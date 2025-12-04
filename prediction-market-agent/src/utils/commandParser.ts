/**
 * Command Parser - Extracts and validates JSON commands from AI responses
 */

export interface Command {
    action: string;
    params: Record<string, any>;
}

export interface ParsedResponse {
    hasCommand: boolean;
    command?: Command;
    textBeforeCommand: string;
    textAfterCommand: string;
}

/**
 * Parse AI response to extract JSON commands
 */
export function parseAIResponse(response: string): ParsedResponse {
    // Look for JSON code blocks
    const jsonBlockRegex = /```json\s*\n([\s\S]*?)\n```/g;
    const match = jsonBlockRegex.exec(response);

    if (!match) {
        return {
            hasCommand: false,
            textBeforeCommand: response,
            textAfterCommand: '',
        };
    }

    try {
        const jsonString = match[1].trim();
        const command = JSON.parse(jsonString) as Command;

        // Validate command structure
        if (!command.action || !command.params) {
            throw new Error('Invalid command structure');
        }

        // Split response into parts
        const commandStart = match.index;
        const commandEnd = commandStart + match[0].length;
        const textBeforeCommand = response.substring(0, commandStart).trim();
        const textAfterCommand = response.substring(commandEnd).trim();

        return {
            hasCommand: true,
            command,
            textBeforeCommand,
            textAfterCommand,
        };
    } catch (error) {
        console.error('Failed to parse command:', error);
        return {
            hasCommand: false,
            textBeforeCommand: response,
            textAfterCommand: '',
        };
    }
}

/**
 * Validate command parameters based on action type
 */
export function validateCommand(command: Command): { valid: boolean; error?: string } {
    const { action, params } = command;

    switch (action) {
        case 'get_market_data':
            if (!params.marketId) {
                return { valid: false, error: 'marketId is required' };
            }
            return { valid: true };

        case 'analyze_prediction':
            if (!params.marketId || !params.userBalance || !params.riskTolerance) {
                return { valid: false, error: 'marketId, userBalance, and riskTolerance are required' };
            }
            return { valid: true };

        case 'get_portfolio':
            if (!params.walletAddress) {
                return { valid: false, error: 'walletAddress is required' };
            }
            return { valid: true };

        case 'execute_trade':
            if (!params.marketId || !params.choice || !params.amount || !params.walletAddress) {
                return { valid: false, error: 'marketId, choice, amount, and walletAddress are required' };
            }
            if (!['YES', 'NO'].includes(params.choice)) {
                return { valid: false, error: 'choice must be YES or NO' };
            }
            return { valid: true };

        case 'get_market_history':
            if (!params.marketId) {
                return { valid: false, error: 'marketId is required' };
            }
            return { valid: true };

        default:
            return { valid: false, error: `Unknown action: ${action}` };
    }
}
