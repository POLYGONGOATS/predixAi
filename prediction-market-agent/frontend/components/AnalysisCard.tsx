import React from 'react';

export interface AnalysisResult {
    recommendation: 'BUY_YES' | 'BUY_NO';
    confidence: number;
    suggestedAmount: number;
    expectedRoi: number;
    riskLevel: string;
    reasoning: string;
    marketQuestion?: string;
}

interface AnalysisCardProps {
    analysis: AnalysisResult;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function AnalysisCard({ analysis, onConfirm, onCancel }: AnalysisCardProps) {
    const isBuyYes = analysis.recommendation === 'BUY_YES';
    const colorClass = isBuyYes ? 'text-green-400' : 'text-red-400';
    const bgClass = isBuyYes ? 'bg-green-500/20' : 'bg-red-500/20';
    const borderClass = isBuyYes ? 'border-green-500/50' : 'border-red-500/50';

    return (
        <div className={`glass p-5 rounded-xl border ${borderClass} mt-4 max-w-md`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-lg">AI Trading Analysis</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${bgClass} ${colorClass}`}>
                    {analysis.recommendation.replace('_', ' ')}
                </span>
            </div>

            {analysis.marketQuestion && (
                <p className="text-sm text-gray-300 mb-4 italic">"{analysis.marketQuestion}"</p>
            )}

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${isBuyYes ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${analysis.confidence}%` }}
                            />
                        </div>
                        <span className="text-white font-medium">{analysis.confidence}%</span>
                    </div>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={`capitalize font-medium ${analysis.riskLevel === 'high' ? 'text-red-400' :
                        analysis.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                        {analysis.riskLevel}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Suggested Amount</span>
                    <span className="text-white font-mono">${analysis.suggestedAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Expected ROI</span>
                    <span className="text-green-400 font-mono">+{analysis.expectedRoi.toFixed(1)}%</span>
                </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 mb-6 text-sm text-gray-300 leading-relaxed">
                <span className="text-primary-400 font-medium">Reasoning: </span>
                {analysis.reasoning}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all font-medium text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`flex-1 py-2 rounded-lg ${isBuyYes ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white transition-all font-medium text-sm shadow-lg`}
                >
                    Confirm Trade
                </button>
            </div>
        </div>
    );
}
