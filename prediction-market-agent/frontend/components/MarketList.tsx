import React from 'react';
import MarketCard from './MarketCard';

interface Market {
    marketId: string;
    question: string;
    description: string;
    outcomes: string[];
    prices: number[];
    volume: number;
    liquidity: number;
    endDate: string;
    active: boolean;
}

interface MarketListProps {
    markets: Market[];
    onBet: (marketId: string) => void;
}

export default function MarketList({ markets, onBet }: MarketListProps) {
    if (!markets || markets.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {markets.map((market) => (
                <MarketCard key={market.marketId} market={market} onBet={onBet} />
            ))}
        </div>
    );
}
