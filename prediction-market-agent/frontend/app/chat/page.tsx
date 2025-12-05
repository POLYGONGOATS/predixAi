import ChatInterface from '@/components/ChatInterface';
import { WalletConnect } from '@/components/WalletConnect';
import FuzzyText from '@/components/FuzzyText';
import CircuitBoardLayout from '@/components/CircuitBoardLayout';

export default function ChatPage() {
    return (
        <CircuitBoardLayout>
            <div className="min-h-screen relative overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient-shift -z-20" />

                {/* Particle effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 6}s`,
                                animationDuration: `${6 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                {/* Glow orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10" />

                <div className="h-screen flex flex-col relative z-10">
                    <ChatInterface />
                </div>
            </div>
        </CircuitBoardLayout>
    );
}
