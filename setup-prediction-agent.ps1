# ONE-LINER SETUP FOR PREDICTION MARKET AI AGENT (PowerShell Version)
# Just run this in PowerShell and it creates everything!

$ErrorActionPreference = "Stop"

$PROJECT_NAME = "prediction-market-agent"

# Create project directory
New-Item -ItemType Directory -Force -Path $PROJECT_NAME | Out-Null
Set-Location $PROJECT_NAME

# Create all directories
@("src/agent", "src/mcp", "src/blockchain", "src/utils", "tests", "demos") | ForEach-Object {
    New-Item -ItemType Directory -Force -Path $_ | Out-Null
}

# ============ ROOT LEVEL FILES ============

# .gitignore
@"
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
coverage/
.idea/
.vscode/
"@ | Out-File -FilePath ".gitignore" -Encoding utf8

# package.json
@"
{
  "name": "prediction-market-agent",
  "version": "1.0.0",
  "description": "AI-powered prediction market trading agent using Nullshot and MCP",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "format": "prettier --write src/**/*.ts",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": ["ai", "blockchain", "prediction-market", "mcp", "nullshot"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.28.0",
    "dotenv": "^16.4.5",
    "ethers": "^6.13.0",
    "viem": "^2.17.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@typescript-eslint/eslint-plugin": "^6.20.0",
    "@typescript-eslint/parser": "^6.20.0",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "prettier": "^3.1.0",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
"@ | Out-File -FilePath "package.json" -Encoding utf8

# tsconfig.json
@"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding utf8

# .env.example
@"
ANTHROPIC_API_KEY=your_api_key_here
PRIVATE_KEY=your_private_key_here
RPC_URL_BSC=https://bsc-dataseed1.binance.org/
RPC_URL_ETH=https://eth.rpc.example.com/
MARKET_CONTRACT_ADDRESS=0x...
MARKET_ABI_PATH=./src/blockchain/abi/market.json
LOG_LEVEL=info
ENABLE_TRADES=false
"@ | Out-File -FilePath ".env.example" -Encoding utf8

# .prettierrc
@"
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
"@ | Out-File -FilePath ".prettierrc" -Encoding utf8

# .eslintrc.json
@"
{
  "env": {
    "node": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
"@ | Out-File -FilePath ".eslintrc.json" -Encoding utf8

# ============ SOURCE FILES ============

# src/index.ts
@"
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { runAgent } from './agent';

dotenv.config();

async function main() {
  try {
    logger.info('Starting Prediction Market AI Agent...');
    
    const userMessage = process.argv[2] || 'Analyze current prediction markets and recommend a trade';
    const walletAddress = process.env.WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
    
    await runAgent({
      userMessage,
      walletAddress,
      riskTolerance: 'moderate'
    });
    
  } catch (error) {
    logger.error('Agent error:', error);
    process.exit(1);
  }
}

main();
"@ | Out-File -FilePath "src/index.ts" -Encoding utf8

# src/utils/logger.ts
@"
export const logger = {
  info: (message: string, data?: unknown) => {
    console.log('\x1b[36m%s\x1b[0m', ``[INFO] `${message}``, data || '');
  },
  
  error: (message: string, error?: unknown) => {
    console.error('\x1b[31m%s\x1b[0m', ``[ERROR] `${message}``, error || '');
  },
  
  warn: (message: string, data?: unknown) => {
    console.warn('\x1b[33m%s\x1b[0m', ``[WARN] `${message}``, data || '');
  },
  
  debug: (message: string, data?: unknown) => {
    if (process.env.DEBUG === 'true') {
      console.log('\x1b[35m%s\x1b[0m', ``[DEBUG] `${message}``, data || '');
    }
  }
};
"@ | Out-File -FilePath "src/utils/logger.ts" -Encoding utf8

# src/utils/config.ts
@"
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  privateKey: process.env.PRIVATE_KEY || '',
  rpcBsc: process.env.RPC_URL_BSC || 'https://bsc-dataseed1.binance.org/',
  rpcEth: process.env.RPC_URL_ETH || 'https://eth.rpc.example.com/',
  marketContractAddress: process.env.MARKET_CONTRACT_ADDRESS || '',
  maxTradePercentage: 0.1,
  minExpectedRoi: 0.05,
  enableTrades: process.env.ENABLE_TRADES === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
};
"@ | Out-File -FilePath "src/utils/config.ts" -Encoding utf8

# src/mcp/schemas.ts
@"
import { z } from 'zod';

export const MarketIdSchema = z.string().min(3).describe('Unique market identifier');
export const ChainSchema = z.enum(['bsc', 'ethereum']).describe('Blockchain network');
export const ChoiceSchema = z.enum(['YES', 'NO']).describe('Trading direction');
export const RiskToleranceSchema = z.enum(['conservative', 'moderate', 'aggressive']);

export const GetMarketDataSchema = z.object({
  marketId: MarketIdSchema,
  chain: ChainSchema.optional().default('bsc'),
});

export const AnalyzePredictionSchema = z.object({
  marketId: MarketIdSchema,
  userBalance: z.number().positive(),
  riskTolerance: RiskToleranceSchema,
});

export const PlacePredictionSchema = z.object({
  marketId: MarketIdSchema,
  choice: ChoiceSchema,
  amount: z.number().positive(),
  chain: ChainSchema,
});

export const GetUserPortfolioSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}`$/),
});

export const GetMarketHistorySchema = z.object({
  marketId: MarketIdSchema,
  days: z.number().int().positive().default(7),
  chain: ChainSchema.optional().default('bsc'),
});

export type GetMarketDataInput = z.infer<typeof GetMarketDataSchema>;
export type AnalyzePredictionInput = z.infer<typeof AnalyzePredictionSchema>;
export type PlacePredictionInput = z.infer<typeof PlacePredictionSchema>;
export type GetUserPortfolioInput = z.infer<typeof GetUserPortfolioSchema>;
export type GetMarketHistoryInput = z.infer<typeof GetMarketHistorySchema>;
"@ | Out-File -FilePath "src/mcp/schemas.ts" -Encoding utf8

# src/mcp/handlers.ts
@"
import { logger } from '../utils/logger';
import {
  GetMarketDataInput,
  AnalyzePredictionInput,
  PlacePredictionInput,
  GetUserPortfolioInput,
  GetMarketHistoryInput,
} from './schemas';

const MOCK_MARKETS: Record<string, any> = {
  BTC_PRICE: {
    marketId: 'BTC_PRICE',
    yesPrice: 2.5,
    noPrice: 1.9,
    volume: 500,
    liquidity: 1000,
    resolutionTime: '2024-12-31',
    state: 'open',
  },
  MESSI_GOAL: {
    marketId: 'MESSI_GOAL',
    yesPrice: 1.8,
    noPrice: 2.2,
    volume: 250,
    liquidity: 500,
    resolutionTime: '2024-12-10',
    state: 'open',
  },
};

export async function getMarketData(input: GetMarketDataInput) {
  logger.debug('getMarketData handler', input);
  const market = MOCK_MARKETS[input.marketId];
  if (!market) throw new Error(``Market `${input.marketId}` not found``);
  return { ...market, chain: input.chain };
}

export async function analyzePrediction(input: AnalyzePredictionInput) {
  logger.debug('analyzePrediction handler', input);
  const market = MOCK_MARKETS[input.marketId];
  if (!market) throw new Error(``Market `${input.marketId}` not found``);
  
  const yesImplied = 1 / market.yesPrice;
  const baseAmount = input.userBalance * 0.1;
  const riskMultiplier = { conservative: 0.5, moderate: 1.0, aggressive: 1.5 }[input.riskTolerance];
  const suggestedAmount = baseAmount * riskMultiplier;
  
  return {
    recommendation: yesImplied > 0.5 ? 'BUY_YES' : 'BUY_NO',
    confidence: 72,
    suggestedAmount,
    expectedRoi: 0.08,
    riskLevel: input.riskTolerance === 'aggressive' ? 'high' : 'medium',
    reasoning: ``Market shows `${(yesImplied * 100).toFixed(1)}`% implied probability for YES.``,
  };
}

export async function placePrediction(input: PlacePredictionInput) {
  logger.debug('placePrediction handler', input);
  if (!process.env.ENABLE_TRADES || process.env.ENABLE_TRADES !== 'true') {
    return {
      success: true,
      transactionHash: '0x' + '0'.repeat(64),
      marketId: input.marketId,
      choice: input.choice,
      amount: input.amount,
      status: 'SIMULATED',
    };
  }
  return {
    success: true,
    transactionHash: '0x' + Math.random().toString(16).substr(2),
    marketId: input.marketId,
    choice: input.choice,
    amount: input.amount,
    status: 'PENDING',
  };
}

export async function getUserPortfolio(input: GetUserPortfolioInput) {
  logger.debug('getUserPortfolio handler', input);
  return {
    walletAddress: input.walletAddress,
    totalValue: 2.5,
    activePositions: [
      { marketId: 'BTC_PRICE', choice: 'YES', amount: 0.1, entryPrice: 2.5, currentValue: 0.27 },
    ],
    totalPnL: 0.12,
    totalPnLPercentage: 4.8,
  };
}

export async function getMarketHistory(input: GetMarketHistoryInput) {
  logger.debug('getMarketHistory handler', input);
  const history = [];
  for (let i = input.days; i > 0; i--) {
    history.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      yesPrice: 2.3 + Math.random() * 0.4,
      noPrice: 1.8 + Math.random() * 0.4,
      volume: 400 + Math.random() * 200,
    });
  }
  return { marketId: input.marketId, chain: input.chain, history, trend: 'stable', volatility: 0.12 };
}
"@ | Out-File -FilePath "src/mcp/handlers.ts" -Encoding utf8

# src/agent/prompts.ts
@"
export const systemPrompt = ``
You are a Prediction Market Trading Agent. Your job is to analyze prediction markets and help users make profitable trades while managing risk.

## Your Responsibilities
1. Analyze prediction markets using available data
2. Recommend profitable trades based on data-driven analysis
3. Execute trades when the user approves
4. Track portfolios and report P&L
5. Manage risk by enforcing position limits

## Important Rules
- NEVER trade more than 10% of user's balance per trade
- ONLY recommend trades with expected ROI > 5%
- ALWAYS explain your reasoning before recommending a trade
- ALWAYS ask for user confirmation before executing any trade
- Never take excessive risk

## Available Tools
1. get_market_data - Fetch live market data
2. analyze_prediction - Get trading recommendations
3. place_prediction - Execute a trade (REQUIRES user approval)
4. get_user_portfolio - Check user's holdings
5. get_market_history - Analyze historical trends

Remember: You're here to help users make smarter trading decisions!
``;

export const userGreeting = ``Welcome to the Prediction Market AI Agent! 👋``;
"@ | Out-File -FilePath "src/agent/prompts.ts" -Encoding utf8

# src/agent/tools.ts
@"
import {
  GetMarketDataSchema,
  AnalyzePredictionSchema,
  PlacePredictionSchema,
  GetUserPortfolioSchema,
  GetMarketHistorySchema,
} from '../mcp/schemas';

export const mcpTools = [
  {
    name: 'get_market_data',
    description: 'Fetch current prediction market data',
    input_schema: GetMarketDataSchema,
  },
  {
    name: 'analyze_prediction',
    description: 'Get trading recommendations based on risk tolerance',
    input_schema: AnalyzePredictionSchema,
  },
  {
    name: 'place_prediction',
    description: 'Execute a prediction trade (REQUIRES user approval)',
    input_schema: PlacePredictionSchema,
  },
  {
    name: 'get_user_portfolio',
    description: 'Get portfolio information',
    input_schema: GetUserPortfolioSchema,
  },
  {
    name: 'get_market_history',
    description: 'Fetch historical market data',
    input_schema: GetMarketHistorySchema,
  },
];
"@ | Out-File -FilePath "src/agent/tools.ts" -Encoding utf8

# src/agent/index.ts
@"
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';
import { systemPrompt } from './prompts';
import { mcpTools } from './tools';
import {
  getMarketData,
  analyzePrediction,
  placePrediction,
  getUserPortfolio,
  getMarketHistory,
} from '../mcp/handlers';
import {
  GetMarketDataSchema,
  AnalyzePredictionSchema,
  PlacePredictionSchema,
  GetUserPortfolioSchema,
  GetMarketHistorySchema,
} from '../mcp/schemas';

interface AgentConfig {
  userMessage: string;
  walletAddress: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

const client = new Anthropic();

export async function runAgent(config: AgentConfig): Promise<void> {
  logger.info('Starting agent');

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: config.userMessage },
  ];

  let continueLoop = true;

  while (continueLoop) {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: systemPrompt,
      tools: mcpTools as Anthropic.Tool[],
      messages,
    });

    let hasToolUse = false;

    for (const block of response.content) {
      if (block.type === 'text') {
        console.log('\n🤖 Agent:', block.text);
      } else if (block.type === 'tool_use') {
        hasToolUse = true;
        logger.info(``Executing tool: `${block.name}```);

        let toolResult: unknown;

        try {
          switch (block.name) {
            case 'get_market_data': {
              const input = GetMarketDataSchema.parse(block.input);
              toolResult = await getMarketData(input);
              break;
            }
            case 'analyze_prediction': {
              const input = AnalyzePredictionSchema.parse(block.input);
              toolResult = await analyzePrediction(input);
              break;
            }
            case 'place_prediction': {
              const input = PlacePredictionSchema.parse(block.input);
              toolResult = await placePrediction(input);
              break;
            }
            case 'get_user_portfolio': {
              const input = GetUserPortfolioSchema.parse(block.input);
              toolResult = await getUserPortfolio(input);
              break;
            }
            case 'get_market_history': {
              const input = GetMarketHistorySchema.parse(block.input);
              toolResult = await getMarketHistory(input);
              break;
            }
            default:
              throw new Error(``Unknown tool: `${block.name}```);
          }
        } catch (error) {
          logger.error(``Tool failed:``, error);
          toolResult = { error: error instanceof Error ? error.message : String(error) };
        }

        messages.push({ role: 'assistant', content: response.content });
        messages.push({
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(toolResult),
            },
          ],
        });
      }
    }

    if (response.stop_reason === 'end_turn' || !hasToolUse) {
      continueLoop = false;
    }
  }

  logger.info('Agent finished');
}
"@ | Out-File -FilePath "src/agent/index.ts" -Encoding utf8

# ============ INSTALLATION ============

Write-Host ""
Write-Host "✅ All files created!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy-Item .env.example .env"
Write-Host "2. Get your API key from https://console.anthropic.com"
Write-Host "3. Edit .env and add: ANTHROPIC_API_KEY=your_key_here"
Write-Host "4. npm run build"
Write-Host "5. npm run dev"
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Magenta
