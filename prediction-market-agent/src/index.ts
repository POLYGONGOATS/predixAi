import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { systemPrompt } from './prompts';
import { AiSdkAgent, AIUISDKMessage, AgentEnv, Service } from './nullshot';
import {
    getMarketData,
    analyzePrediction,
    placePrediction,
    getUserPortfolio,
    getMarketHistory,
} from './mcp/handlers';

// Environment interface for Cloudflare Workers
interface Env extends AgentEnv {
    PERPLEXITY_API_KEY: string;
    AI_PROVIDER: string;
    ENABLE_TRADES?: string;
    PREDICTION_AGENT: DurableObjectNamespace;
}

// Define MCP tools using AI SDK tool format
const analyzePredictionParams = z.object({
    marketId: z.string().describe('The market to analyze'),
    userBalance: z.number().describe("User's available balance for trading"),
    riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).describe("User's risk tolerance level"),
});
const predictionMarketTools = {
    get_market_data: tool({
        description: 'Fetch live prediction market data including prices, volume, and liquidity',
        parameters: z.object({
            marketId: z.string().describe('The unique identifier for the prediction market'),
            chain: z.string().default('ethereum').describe('The blockchain network'),
        }),
        execute: async ({ marketId, chain }: { marketId: string; chain: string }) => {
            return await getMarketData({ marketId, chain });
        },
    } as any),

    analyze_prediction: tool({
        description: 'Analyze a prediction market and get AI-powered trading recommendations',
        parameters: analyzePredictionParams,
        execute: async ({ marketId, userBalance, riskTolerance }: z.infer<typeof analyzePredictionParams>) => {
            return await analyzePrediction({ marketId, userBalance, riskTolerance });
        },
    } as any),

    place_prediction: tool({
        description: 'Generate a transaction for the user to sign and execute a trade. Use this whenever the user wants to buy/sell/trade.',
        parameters: z.object({
            marketId: z.string().describe('The market to trade on'),
            choice: z.enum(['YES', 'NO']).describe('The prediction choice'),
            amount: z.number().describe('Amount to invest'),
            walletAddress: z.string().describe("User's actual hex wallet address (starts with 0x). DO NOT use 'user_wallet' or placeholders."),
        }),
        execute: async ({ marketId, choice, amount, walletAddress }: { marketId: string; choice: 'YES' | 'NO'; amount: number; walletAddress: string }) => {
            return await placePrediction({ marketId, choice, amount, walletAddress });
        },
    } as any),

    get_user_portfolio: tool({
        description: "Retrieve user's current portfolio and positions",
        parameters: z.object({
            walletAddress: z.string().describe("User's wallet address"),
            chain: z.string().default('ethereum').describe('The blockchain network'),
        }),
        execute: async ({ walletAddress, chain }: { walletAddress: string; chain: string }) => {
            return await getUserPortfolio({ walletAddress, chain });
        },
    } as any),

    get_market_history: tool({
        description: 'Get historical price and volume data for a prediction market',
        parameters: z.object({
            marketId: z.string().describe('The market to get history for'),
            days: z.number().default(7).describe('Number of days of history to retrieve'),
            chain: z.string().default('ethereum').describe('The blockchain network'),
        }),
        execute: async ({ marketId, days, chain }: { marketId: string; days: number; chain: string }) => {
            return await getMarketHistory({ marketId, days, chain });
        },
    } as any),
};

// Prediction Market Agent extending Nullshot AiSdkAgent
export class PredictionMarketAgent extends AiSdkAgent<Env> {
    constructor(state: DurableObjectState, env: Env) {
        // Custom fetch to fix Perplexity API endpoint and request format
        const customFetch: typeof fetch = async (url, init) => {
            // Convert /responses to /chat/completions for Perplexity
            const urlString = url.toString();
            if (urlString.includes('/responses')) {
                url = urlString.replace('/responses', '/chat/completions');

                // Also need to transform the request body
                if (init && init.body) {
                    try {
                        const body = JSON.parse(init.body as string);
                        // Transform 'input' to 'messages' for Perplexity compatibility
                        if (body.input && !body.messages) {
                            body.messages = body.input;
                            delete body.input;
                        }
                        // Remove unsupported fields
                        delete body.conversation;
                        delete body.max_tool_calls;
                        delete body.metadata;
                        delete body.parallel_tool_calls;
                        delete body.previous_response_id;
                        delete body.store;
                        delete body.instructions;
                        delete body.service_tier;
                        delete body.include;
                        delete body.prompt_cache_key;
                        delete body.prompt_cache_retention;
                        delete body.safety_identifier;
                        delete body.top_logprobs;
                        delete body.truncation;

                        init = { ...init, body: JSON.stringify(body) };
                    } catch (e) {
                        console.error('Error transforming request body:', e);
                    }
                }
            }
            return fetch(url, init);
        };

        // Create Perplexity AI provider using OpenAI-compatible endpoint
        const perplexity = createOpenAI({
            apiKey: env.PERPLEXITY_API_KEY,
            baseURL: 'https://api.perplexity.ai',
            fetch: customFetch,
        });

        // Use Perplexity's Sonar Pro model with chat completions endpoint
        const model = perplexity.chat('sonar-pro');

        // Initialize with no additional services for now
        const services: Service[] = [];

        super(state, env, model, services);
    }


    async processMessage(sessionId: string, message: AIUISDKMessage): Promise<Response> {
        try {
            console.log('Processing message with Perplexity...');
            console.log('Messages:', JSON.stringify(message.messages));

            // Import command parser and executor
            const { parseAIResponse, validateCommand } = await import('./utils/commandParser');
            const { commandExecutor } = await import('./services/commandExecutor');

            let conversationMessages = [...message.messages];
            let maxIterations = 3; // Prevent infinite loops
            let iteration = 0;
            let lastCommandResult: any = null;

            while (iteration < maxIterations) {
                iteration++;
                console.log(`Iteration ${iteration}/${maxIterations}`);

                // Get AI response
                const result = await this.streamTextWithMessages(sessionId, conversationMessages, {
                    system: systemPrompt,
                    maxSteps: 1,
                });

                // Wait for the complete response
                const fullResponse = await result.text;

                console.log('AI Response:', fullResponse);

                // Parse response for commands
                const parsed = parseAIResponse(fullResponse);

                if (!parsed.hasCommand) {
                    // No command found, return the response
                    // If we have a previous command result, append it so frontend can render UI
                    let finalResponse = fullResponse;
                    if (lastCommandResult) {
                        finalResponse += `\n\n\`\`\`json\n${JSON.stringify(lastCommandResult, null, 2)}\n\`\`\``;
                    }

                    console.log('No command found, returning response');
                    return new Response(finalResponse, {
                        headers: {
                            'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*',
                        },
                    });
                }

                // Validate and execute command
                const validation = validateCommand(parsed.command!);
                if (!validation.valid) {
                    console.error('Invalid command:', validation.error);
                    // Return response with error message
                    return new Response(
                        `${parsed.textBeforeCommand}\n\n❌ Error: ${validation.error}\n\n${parsed.textAfterCommand}`,
                        {
                            headers: {
                                'Content-Type': 'text/plain',
                                'Access-Control-Allow-Origin': '*',
                            },
                        }
                    );
                }

                // Execute command
                console.log('Executing command:', parsed.command);
                const commandResult = await commandExecutor.execute(parsed.command!);
                console.log('Command result:', commandResult);

                // Store result for final output
                if (commandResult.success) {
                    lastCommandResult = commandResult.data;
                }

                // If this is the last iteration or command failed, return response with result
                if (iteration >= maxIterations || !commandResult.success) {
                    const resultText = commandResult.success
                        ? `\n\n✅ **Command Result:**\n\`\`\`json\n${JSON.stringify(commandResult.data, null, 2)}\n\`\`\``
                        : `\n\n❌ **Error:** ${commandResult.error}`;

                    return new Response(
                        `${parsed.textBeforeCommand}${resultText}\n\n${parsed.textAfterCommand}`,
                        {
                            headers: {
                                'Content-Type': 'text/plain',
                                'Access-Control-Allow-Origin': '*',
                            },
                        }
                    );
                }

                // Add command result to conversation and continue
                conversationMessages.push({
                    role: 'assistant',
                    content: fullResponse,
                });
                conversationMessages.push({
                    role: 'user',
                    content: `Command executed successfully. Result:\n\`\`\`json\n${JSON.stringify(commandResult.data, null, 2)}\n\`\`\`\n\nPlease analyze this data and provide your insights to the user.`,
                });
            }

            // If we've exhausted iterations, return the last response
            return new Response('Maximum iterations reached', {
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        } catch (error) {
            console.error('Error in processMessage:', error);
            throw error;
        }
    }
}

// Create Hono app for routing
const app = new Hono<{ Bindings: Env }>();

// CORS middleware using Hono's built-in helper
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));

// Main route - redirect to agent
app.post('/agent/:sessionId', async (c) => {
    try {
        const sessionId = c.req.param('sessionId');
        const id = c.env.PREDICTION_AGENT.idFromName(sessionId);
        const stub = c.env.PREDICTION_AGENT.get(id);

        // Read the request body first to prevent it from being consumed
        const body = await c.req.text();

        // Forward request to Durable Object with fresh body
        const forwardRequest = new Request(`https://internal.com/agent/chat/${sessionId}`, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return stub.fetch(forwardRequest);
    } catch (error) {
        console.error('Error in /agent/:sessionId route:', error);
        return c.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, 500);
    }
});

app.get('/', (c) => {
    return c.json({
        name: 'Prediction Market AI Agent',
        description: 'AI-powered prediction market trading agent using Nullshot Framework',
        version: '1.0.0',
        framework: 'Nullshot AiSdkAgent',
        aiProvider: 'Perplexity Sonar (Online)',
        endpoints: {
            chat: 'POST /agent/:sessionId',
        },
    });
});

export default {
    fetch: app.fetch,
};
