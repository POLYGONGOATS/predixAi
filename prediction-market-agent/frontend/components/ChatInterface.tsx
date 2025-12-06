'use client';

import { useState, useRef, useEffect } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import MarketList from './MarketList';
import AnalysisCard, { AnalysisResult } from './AnalysisCard';
import { WalletConnect } from './WalletConnect';
import Navbar from './Navbar';

interface MessageData {
    markets?: any[];
    recommendation?: string;
    suggestedAmount?: number;
    marketId?: string;
    transactionHash?: string;
    confidence?: number;
    expectedRoi?: number;
    riskLevel?: string;
    reasoning?: string;
    marketQuestion?: string;
    [key: string]: any;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    data?: MessageData; // Store parsed JSON data
}

export default function ChatInterface() {
    const { address } = useAccount();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Convert timestamp strings back to Date objects
                const messagesWithDates = parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(messagesWithDates);
            } catch (e) {
                console.error('Failed to load chat history', e);
                // Set default welcome message if loading fails
                setMessages([{
                    role: 'assistant',
                    content: '👋 Hello! I\'m your AI-powered prediction market assistant. I can help you analyze markets, get trading recommendations, and track your portfolio. What would you like to know?',
                    timestamp: new Date(),
                }]);
            }
        } else {
            // Set default welcome message if no history exists
            setMessages([{
                role: 'assistant',
                content: '👋 Hello! I\'m your AI-powered prediction market assistant. I can help you analyze markets, get trading recommendations, and track your portfolio. What would you like to know?',
                timestamp: new Date(),
            }]);
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Helper to extract JSON from message content
    const extractDataFromContent = (content: string): MessageData | null => {
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.error('Failed to parse JSON from message', e);
            }
        }
        return null;
    };

    const { sendTransactionAsync } = useSendTransaction();

    const sendMessage = async (text: string = input) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        console.log('Current wallet address:', address);

        try {
            // Prepare message history for the backend
            // 1. Get last 6 messages to maintain context without overloading
            // 2. Sanitize: Only send role and content, remove local data/UI state
            const recentMessages = messages.slice(-6).map(m => ({
                role: m.role,
                content: m.content || ' ' // Ensure content is never empty
            }));

            // Add wallet address context if available - PREPEND to start
            if (address) {
                console.log('Injecting wallet address into context:', address);
                recentMessages.unshift({
                    role: 'system',
                    content: `User's connected wallet address is: ${address}`
                } as any);
            } else {
                console.warn('No wallet address available to inject');
            }

            // Add current user message
            recentMessages.push({ role: 'user', content: text });

            console.log('Sending messages to backend:', JSON.stringify(recentMessages, null, 2));

            let response;
            try {
                // Attempt 1: Send with history
                response = await fetch('http://127.0.0.1:8787/agent/frontend-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: Date.now().toString(),
                        messages: recentMessages,
                        walletAddress: address,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to get response with history: ${response.status} ${errorText}`);
                }
            } catch (historyError) {
                console.warn('Failed to send history, retrying with latest message only:', historyError);
                // Attempt 2: Fallback to latest message only
                response = await fetch('http://127.0.0.1:8787/agent/frontend-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: Date.now().toString(),
                        messages: [{ role: 'user', content: text }],
                        walletAddress: address,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to get response (fallback): ${response.status} ${errorText}`);
                }
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';

            if (reader) {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    aiResponse += decoder.decode(value);
                }
            }

            // Extract structured data if present
            const data = extractDataFromContent(aiResponse);
            // Clean content by removing the JSON block for display
            const cleanContent = aiResponse.replace(/```json\n[\s\S]*?\n```/, '').trim();

            let finalData = data;
            let finalContent = cleanContent || 'Here is the information you requested:';

            // Handle PENDING_SIGNATURE
            if (data && data.status === 'PENDING_SIGNATURE' && data.transactionRequest) {
                try {
                    const txHash = await sendTransactionAsync({
                        to: data.transactionRequest.to,
                        value: BigInt(data.transactionRequest.value),
                        data: data.transactionRequest.data,
                    });

                    finalData = {
                        ...data,
                        transactionHash: txHash,
                        status: 'EXECUTED'
                    };
                    finalContent += `\n\n✅ Transaction sent! Hash: ${txHash}`;
                } catch (txError) {
                    console.error('Transaction failed:', txError);
                    finalContent += `\n\n❌ Transaction failed: ${txError instanceof Error ? txError.message : 'Unknown error'}`;
                }
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: finalContent,
                timestamp: new Date(),
                data: finalData || undefined
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Sorry, there was an error connecting to the AI agent. Please make sure the backend is running.',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBet = (marketId: string) => {
        sendMessage(`Analyze the market ${marketId} and give me a trading recommendation.`);
    };

    const handleConfirmTrade = (analysis: MessageData) => {
        const amount = analysis.suggestedAmount;
        const choice = analysis.recommendation === 'BUY_YES' ? 'YES' : 'NO';
        const marketId = analysis.marketId;

        // Construct a specific command with the market ID
        sendMessage(`Please execute the trade: Buy $${amount} of ${choice} for market ${marketId}.`);
    };

    const quickActions = [
        '📊 Show trending markets',
        '📈 Analyze BTC market',
        '💼 View my portfolio',
        '📉 Market history',
    ];

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all chat history?')) {
            const welcomeMessage = {
                role: 'assistant' as const,
                content: '👋 Hello! I\'m your AI-powered prediction market assistant. I can help you analyze markets, get trading recommendations, and track your portfolio. What would you like to know?',
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
            localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
        }
    };

    return (
        <div
            className="flex flex-col h-full w-full z-50 relative pt-20"
            style={{
                backgroundImage: 'url(/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

            <Navbar />

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3 px-6 py-3 overflow-x-auto border-b border-white/5 bg-black/5 backdrop-blur-sm relative z-10">
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        onClick={() => sendMessage(action.substring(2))}
                        className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/40 border border-white/20 text-sm whitespace-nowrap transition-all transform hover:scale-105 shimmer-hover text-white"
                    >
                        {action}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 relative z-10">
                {messages.map((message, i) => (
                    <div
                        key={i}
                        className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} fade-in`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                    >
                        <div
                            className={`max-w-[85%] p-4 backdrop-blur-md ${message.role === 'user'
                                ? 'rounded-2xl bg-cyan-500/20 backdrop-blur-xl text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                : 'bg-teal-500/5 border-2 border-teal-500/40 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] backdrop-blur-lg'
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                            {/* Render Interactive Components based on Data */}
                            {message.data && message.data.markets && (
                                <MarketList
                                    markets={message.data.markets}
                                    onBet={handleBet}
                                />
                            )}

                            {message.data && message.data.recommendation && (
                                <AnalysisCard
                                    analysis={message.data as AnalysisResult}
                                    onConfirm={() => handleConfirmTrade(message.data!)}
                                    onCancel={() => setMessages(prev => [...prev, {
                                        role: 'assistant',
                                        content: 'Trade cancelled.',
                                        timestamp: new Date()
                                    }])}
                                />
                            )}

                            {message.data && message.data.transactionHash && (
                                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                                        <span>✅ Trade Executed Successfully</span>
                                    </div>
                                    <div className="text-xs text-gray-300 break-all">
                                        Tx Hash: {message.data.transactionHash}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs opacity-60 mt-2">
                                {message.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start fade-in">
                        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse pulse-glow"></div>
                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-75 pulse-glow"></div>
                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-150 pulse-glow"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/10 backdrop-blur-md relative z-10">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about prediction markets..."
                        className="flex-1 px-6 py-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 focus:border-primary-500 outline-none transition-all input-glow text-white placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all transform hover:scale-105 shadow-lg shadow-primary-500/50 pulse-glow"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
