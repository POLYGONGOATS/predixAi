'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import HackerButton from './HackerButton';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/5 bg-black/20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <span
                                className="text-xl font-bold text-cyan-300 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                style={{ fontFamily: '"Ethnocentric", sans-serif' }}
                            >
                                Predix AI
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/markets" className="text-cyan-300 hover:text-cyan-500 transition-colors" style={{ fontFamily: '"Ethnocentric", sans-serif' }}>
                            Markets
                        </Link>
                        <Link href="/portfolio" className="text-cyan-300 hover:text-cyan-500 transition-colors" style={{ fontFamily: '"Ethnocentric", sans-serif' }}>
                            Portfolio
                        </Link>
                        <Link href="/chat" className="text-cyan-300 hover:text-cyan-500 transition-colors" style={{ fontFamily: '"Ethnocentric", sans-serif' }}>
                            AI Agent
                        </Link>
                    </div>

                    {/* Wallet Connect Button */}
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            const ready = mounted && authenticationStatus !== 'loading';
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus ||
                                    authenticationStatus === 'authenticated');

                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        'style': {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <HackerButton
                                                    onClick={openConnectModal}
                                                    text="Connect Wallet"
                                                    className="px-6 py-2 bg-teal-500/5 backdrop-blur-lg border border-teal-500/40 hover:bg-teal-500/10 hover:border-cyan-500/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] text-sm transition-all transform hover:scale-105 text-white"
                                                    disableAnimation
                                                    style={{ fontFamily: '"Ethnocentric", sans-serif' }}
                                                />
                                            );
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <HackerButton
                                                    onClick={openChainModal}
                                                    text="Wrong network"
                                                    className="px-6 py-2 bg-red-500/10 backdrop-blur-lg border border-red-500/40 hover:bg-red-500/20 hover:border-red-500/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] text-sm transition-all transform hover:scale-105 text-white"
                                                    disableAnimation
                                                    style={{ fontFamily: '"Ethnocentric", sans-serif' }}
                                                />
                                            );
                                        }

                                        return (
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <HackerButton
                                                    onClick={openChainModal}
                                                    text={chain.name ?? 'Chain'}
                                                    className="hidden md:block px-4 py-2 bg-teal-500/5 backdrop-blur-lg border border-teal-500/40 hover:bg-teal-500/10 hover:border-cyan-500/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] text-sm transition-all transform hover:scale-105 text-white"
                                                    disableAnimation
                                                    style={{ fontFamily: '"Ethnocentric", sans-serif' }}
                                                />

                                                <HackerButton
                                                    onClick={openAccountModal}
                                                    text={account.displayName}
                                                    className="px-4 py-2 bg-teal-500/5 backdrop-blur-lg border border-teal-500/40 hover:bg-teal-500/10 hover:border-cyan-500/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] text-sm transition-all transform hover:scale-105 text-white"
                                                    disableAnimation
                                                    style={{ fontFamily: '"Ethnocentric", sans-serif' }}
                                                />
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>
        </nav>
    );
}
