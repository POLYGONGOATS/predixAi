// Polymarket API client for fetching real prediction market data
import axios from 'axios';

const POLYMARKET_API = 'https://gamma-api.polymarket.com';
const CLOB_API = 'https://clob.polymarket.com';

export interface PolymarketMarket {
    id: string;
    question: string;
    description: string;
    outcomes: string[];
    outcomePrices: string[];
    volume: string;
    liquidity: string;
    endDate: string;
    active: boolean;
}

export interface MarketData {
    marketId: string;
    question: string;
    yesPrice: number;
    noPrice: number;
    volume: number;
    liquidity: number;
    lastUpdate: string;
}

/**
 * Fetch trending/active markets from Polymarket
 */
export async function fetchTrendingMarkets(limit: number = 10): Promise<PolymarketMarket[]> {
    try {
        const response = await axios.get(`${POLYMARKET_API}/markets`, {
            params: {
                limit,
                active: true,
                closed: false,
            },
            timeout: 10000,
        });

        return response.data || [];
    } catch (error) {
        console.error('Error fetching trending markets:', error);
        return [];
    }
}

/**
 * Fetch specific market data by ID or slug
 */
export async function fetchMarketById(marketId: string): Promise<MarketData | null> {
    try {
        // Try to fetch from Polymarket API
        const response = await axios.get(`${POLYMARKET_API}/markets/${marketId}`, {
            timeout: 10000,
        });

        const market = response.data;

        if (!market) {
            return null;
        }

        // Parse outcome prices
        const yesPrice = market.outcomePrices ? parseFloat(market.outcomePrices[0]) : 0.5;
        const noPrice = market.outcomePrices ? parseFloat(market.outcomePrices[1]) : 0.5;

        return {
            marketId: market.id || marketId,
            question: market.question || 'Unknown Market',
            yesPrice,
            noPrice,
            volume: parseFloat(market.volume || '0'),
            liquidity: parseFloat(market.liquidity || '0'),
            lastUpdate: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`Error fetching market ${marketId}:`, error);
        return null;
    }
}

/**
 * Search markets by keyword
 */
export async function searchMarkets(query: string, limit: number = 5): Promise<PolymarketMarket[]> {
    try {
        const response = await axios.get(`${POLYMARKET_API}/markets`, {
            params: {
                query,
                limit,
                active: true,
            },
            timeout: 10000,
        });

        return response.data || [];
    } catch (error) {
        console.error('Error searching markets:', error);
        return [];
    }
}

/**
 * Fetch market price history (if available)
 */
export async function fetchMarketHistory(marketId: string, days: number = 7): Promise<any[]> {
    try {
        // Polymarket doesn't have a public history API, so we'll return mock data
        // In production, you'd integrate with a data provider like The Graph
        console.log(`Fetching ${days} days of history for ${marketId}`);

        // Generate mock historical data
        const history = [];
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        for (let i = days; i >= 0; i--) {
            const date = new Date(now - i * dayMs);
            history.push({
                date: date.toISOString().split('T')[0],
                yesPrice: 0.5 + (Math.random() - 0.5) * 0.3,
                noPrice: 0.5 + (Math.random() - 0.5) * 0.3,
                volume: Math.random() * 100000,
            });
        }

        return history;
    } catch (error) {
        console.error('Error fetching market history:', error);
        return [];
    }
}
