import React from 'react';

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

interface MarketCardProps {
    market: Market;
    onBet: (marketId: string) => void;
}

export default function MarketCard({ market, onBet }: MarketCardProps) {
    const yesPrice = market.prices[0];
    const noPrice = market.prices[1];
    const volumeFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(market.volume);

    return (
        <div className="glass p-4 rounded-xl border border-white/10 hover:border-primary-500/50 transition-all group">
            <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                    {market.question}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${market.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {market.active ? 'Active' : 'Closed'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1">YES</div>
                    <div className="text-lg font-bold text-green-400">{(yesPrice * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1">NO</div>
                    <div className="text-lg font-bold text-red-400">{(noPrice * 100).toFixed(1)}%</div>
                </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                <div>Vol: {volumeFormatted}</div>
                <div>Ends: {new Date(market.endDate).toLocaleDateString()}</div>
            </div>

            <button
                onClick={() => onBet(market.marketId)}
                className="w-full py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500 text-primary-300 hover:text-white transition-all font-medium text-sm"
            >
                Bet on this
            </button>
        </div>
    );
}
