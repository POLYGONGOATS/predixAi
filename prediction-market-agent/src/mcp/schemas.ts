import { z } from 'zod';

export const MarketIdSchema = z.string().min(3).describe('Unique market identifier');
export const ChainSchema = z.enum(['bsc', 'ethereum']).describe('Blockchain network');
export const ChoiceSchema = z.enum(['YES', 'NO']).describe('Trading direction');
export const RiskToleranceSchema = z.enum(['conservative', 'moderate', 'aggressive']);

export const GetMarketDataSchema = z.object({
    marketId: MarketIdSchema,
    chain: z.string().default('ethereum'),
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
    walletAddress: z.string(),
});

export const GetUserPortfolioSchema = z.object({
    walletAddress: z.string(),
    chain: z.string().default('ethereum'),
});

export const GetMarketHistorySchema = z.object({
    marketId: MarketIdSchema,
    days: z.number().int().positive().default(7),
    chain: z.string().default('ethereum'),
});

export type GetMarketDataInput = z.infer<typeof GetMarketDataSchema>;
export type AnalyzePredictionInput = z.infer<typeof AnalyzePredictionSchema>;
export type PlacePredictionInput = z.infer<typeof PlacePredictionSchema>;
export type GetUserPortfolioInput = z.infer<typeof GetUserPortfolioSchema>;
export type GetMarketHistoryInput = z.infer<typeof GetMarketHistorySchema>;
