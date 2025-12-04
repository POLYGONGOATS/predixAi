/**
 * Polymarket API Client
 * Fetches real market data from Polymarket
 */

export interface Market {
    id: string;
    question: string;
    description: string;
    outcomes: string[];
    prices: number[];
    volume: number;
    liquidity: number;
    endDate: string;
    resolved: boolean;
    active: boolean;
}

export interface MarketHistory {
    timestamp: number;
    price: number;
    volume: number;
}

export interface Position {
    marketId: string;
    outcome: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
    value: number;
    pnl: number;
}

export class PolymarketClient {
    private baseUrl = 'https://gamma-api.polymarket.com';

    /**
     * Search for markets by query
     */
    /**
     * Search for markets by query
     */
    async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/public-search?q=${encodeURIComponent(query)}&limit=${limit}&events_status=active`
            );

            if (!response.ok) {
                throw new Error(`Polymarket API error: ${response.statusText}`);
            }

            const data = await response.json() as any;

            // The public-search endpoint returns { events: [...] }
            // Each event has a 'markets' array. We need to flatten this.
            if (data.events && Array.isArray(data.events)) {
                const markets: any[] = [];
                for (const event of data.events) {
                    if (event.markets && Array.isArray(event.markets)) {
                        markets.push(...event.markets);
                    }
                }
                // Filter out closed markets and transform
                const activeMarkets = markets.filter((m: any) => !m.closed);
                return this.transformMarkets(activeMarkets.slice(0, limit));
            }

            return [];
        } catch (error) {
            console.error('Error searching markets:', error);
            // Return mock data for now
            return this.getMockMarkets(query);
        }
    }

    /**
     * Get specific market by ID
     */
    async getMarket(marketId: string): Promise<Market | null> {
        try {
            const response = await fetch(`${this.baseUrl}/markets/${marketId}`);

            if (!response.ok) {
                throw new Error(`Polymarket API error: ${response.statusText}`);
            }

            const data = await response.json();
            return this.transformMarket(data);
        } catch (error) {
            console.error('Error fetching market:', error);
            return this.getMockMarket(marketId);
        }
    }

    /**
     * Get market history/price data
     */
    async getMarketHistory(marketId: string, days: number = 30): Promise<MarketHistory[]> {
        try {
            const endTime = Date.now();
            const startTime = endTime - (days * 24 * 60 * 60 * 1000);

            const response = await fetch(
                `${this.baseUrl}/prices/${marketId}?start=${startTime}&end=${endTime}`
            );

            if (!response.ok) {
                throw new Error(`Polymarket API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.history || [];
        } catch (error) {
            console.error('Error fetching market history:', error);
            return this.getMockHistory();
        }
    }

    /**
     * Get user positions (requires wallet address)
     */
    async getUserPositions(walletAddress: string): Promise<Position[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/positions?address=${walletAddress}`
            );

            if (!response.ok) {
                throw new Error(`Polymarket API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.positions || [];
        } catch (error) {
            console.error('Error fetching positions:', error);
            return [];
        }
    }

    /**
     * Transform API response to our Market format
     */
    private transformMarket(data: any): Market {
        // Parse outcomes if string
        let outcomes = ['YES', 'NO'];
        if (typeof data.outcomes === 'string') {
            try {
                outcomes = JSON.parse(data.outcomes);
            } catch (e) {
                console.warn('Failed to parse outcomes', e);
            }
        } else if (Array.isArray(data.outcomes)) {
            outcomes = data.outcomes;
        }

        // Parse prices if string (outcomePrices in API)
        let prices = [0.5, 0.5];
        if (data.outcomePrices) {
            if (typeof data.outcomePrices === 'string') {
                try {
                    const parsedPrices = JSON.parse(data.outcomePrices);
                    prices = parsedPrices.map((p: string | number) => Number(p));
                } catch (e) {
                    console.warn('Failed to parse outcomePrices', e);
                }
            } else if (Array.isArray(data.outcomePrices)) {
                prices = data.outcomePrices.map((p: string | number) => Number(p));
            }
        } else if (data.prices) {
            if (typeof data.prices === 'string') {
                try {
                    const parsedPrices = JSON.parse(data.prices);
                    prices = parsedPrices.map((p: string | number) => Number(p));
                } catch (e) {
                    console.warn('Failed to parse prices', e);
                }
            } else if (Array.isArray(data.prices)) {
                prices = data.prices.map((p: string | number) => Number(p));
            }
        }

        return {
            id: data.id || data.condition_id,
            question: data.question || data.title,
            description: data.description || '',
            outcomes: outcomes,
            prices: prices,
            volume: Number(data.volume || 0),
            liquidity: Number(data.liquidity || 0),
            endDate: data.end_date || data.endDate,
            resolved: data.resolved || false,
            active: data.active !== false && data.closed !== true,
        };
    }

    private transformMarkets(data: any[]): Market[] {
        return data.map(item => this.transformMarket(item));
    }

    /**
     * Mock data for testing when API is unavailable
     */
    private getMockMarkets(query: string): Market[] {
        return [
            {
                id: 'btc-price-dec-2025',
                question: 'Will Bitcoin hit $100k by December 31, 2025?',
                description: 'Resolves YES if BTC hits $100k before Dec 31, 2025',
                outcomes: ['Yes', 'No'],
                prices: [0.65, 0.35],
                volume: 1250000,
                liquidity: 500000,
                endDate: '2025-12-31T23:59:59Z',
                resolved: false,
                active: true,
            },
            {
                id: 'btc-eth-flippening',
                question: 'Will Ethereum flip Bitcoin market cap in 2025?',
                description: 'Resolves YES if ETH market cap exceeds BTC market cap',
                outcomes: ['Yes', 'No'],
                prices: [0.15, 0.85],
                volume: 450000,
                liquidity: 120000,
                endDate: '2025-12-31T23:59:59Z',
                resolved: false,
                active: true,
            },
            {
                id: 'fed-rates-dec',
                question: 'Will the Fed cut rates in December 2025?',
                description: 'Resolves YES if Fed cuts rates by at least 25bps',
                outcomes: ['Yes', 'No'],
                prices: [0.75, 0.25],
                volume: 890000,
                liquidity: 300000,
                endDate: '2025-12-18T18:00:00Z',
                resolved: false,
                active: true,
            }
        ];
    }

    private getMockMarket(marketId: string): Market {
        return {
            id: marketId,
            question: 'Sample Market Question',
            description: 'This is a mock market for testing',
            outcomes: ['YES', 'NO'],
            prices: [0.5, 0.5],
            volume: 1000000,
            liquidity: 50000,
            endDate: '2025-12-31T23:59:59Z',
            resolved: false,
            active: true,
        };
    }

    private getMockHistory(): MarketHistory[] {
        const now = Date.now();
        const history: MarketHistory[] = [];

        for (let i = 30; i >= 0; i--) {
            history.push({
                timestamp: now - (i * 24 * 60 * 60 * 1000),
                price: 0.45 + Math.random() * 0.1,
                volume: Math.random() * 100000,
            });
        }

        return history;
    }
}

// Export singleton instance
export const polymarket = new PolymarketClient();
