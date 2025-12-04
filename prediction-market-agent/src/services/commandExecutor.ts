/**
 * Command Executor - Executes parsed commands and returns results
 */

import { Command } from '../utils/commandParser';
import { polymarket } from './polymarket';
import {
    getMarketData,
    analyzePrediction,
    placePrediction,
    getUserPortfolio,
    getMarketHistory,
} from '../mcp/handlers';

export interface CommandResult {
    success: boolean;
    data?: any;
    error?: string;
}

export class CommandExecutor {
    /**
     * Execute a command and return the result
     */
    async execute(command: Command): Promise<CommandResult> {
        const { action, params } = command;

        try {
            switch (action) {
                case 'get_market_data':
                    return await this.getMarketData(params);

                case 'analyze_prediction':
                    return await this.analyzePrediction(params);

                case 'get_portfolio':
                    return await this.getPortfolio(params);

                case 'execute_trade':
                    return await this.executeTrade(params);

                case 'get_market_history':
                    return await this.getMarketHistory(params);

                default:
                    return {
                        success: false,
                        error: `Unknown action: ${action}`,
                    };
            }
        } catch (error) {
            console.error(`Error executing command ${action}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    private async getMarketData(params: any): Promise<CommandResult> {
        const { marketId, chain } = params;

        try {
            const result = await getMarketData({ marketId, chain: chain || 'polygon' });
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch market data',
            };
        }
    }

    private async analyzePrediction(params: any): Promise<CommandResult> {
        const { marketId, userBalance, riskTolerance } = params;

        try {
            const result = await analyzePrediction({
                marketId,
                userBalance,
                riskTolerance,
            });
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze prediction',
            };
        }
    }

    private async getPortfolio(params: any): Promise<CommandResult> {
        const { walletAddress, chain } = params;

        try {
            const result = await getUserPortfolio({
                walletAddress,
                chain: chain || 'polygon',
            });
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch portfolio',
            };
        }
    }

    private async executeTrade(params: any): Promise<CommandResult> {
        const { marketId, choice, amount, walletAddress } = params;

        try {
            const result = await placePrediction({
                marketId,
                choice,
                amount,
                walletAddress,
            });
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to execute trade',
            };
        }
    }

    private async getMarketHistory(params: any): Promise<CommandResult> {
        const { marketId, days, chain } = params;

        try {
            const result = await getMarketHistory({
                marketId,
                days: days || 30,
                chain: chain || 'polygon',
            });
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch market history',
            };
        }
    }
}

// Export singleton instance
export const commandExecutor = new CommandExecutor();
