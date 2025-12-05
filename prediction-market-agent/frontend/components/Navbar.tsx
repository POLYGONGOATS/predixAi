'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200" />
                            <div className="relative">
                                <span className="text-xl font-bold text-white">
                                    PredictAI
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/markets" className="text-gray-300 hover:text-white transition-colors">
                            Markets
                        </Link>
                        <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                            Portfolio
                        </Link>
                        <Link href="/chat" className="text-gray-300 hover:text-white transition-colors">
                            AI Agent
                        </Link>
                    </div>

                    {/* Wallet Connect Button */}
                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
}
