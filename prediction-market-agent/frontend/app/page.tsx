import Link from 'next/link';
import CityScapeBackground from '../components/CityScapeBackground';
import Model3D from '../components/Model3D';
import CircuitBoardLayout from '../components/CircuitBoardLayout';
import PredixParticles from '../components/PredixParticles';
import HackerButton from '../components/HackerButton';

export default function Home() {
  return (
    <CircuitBoardLayout>
      {/* TEST: Direct background image */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          opacity: 0.5
        }}
      />

      {/* Cyberpunk Background */}
      <CityScapeBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-6 pt-12 pb-20 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-block px-6 py-3 rounded-full bg-teal-500/5 backdrop-blur-lg border-2 border-teal-500/40 text-sm font-medium text-teal-300 mb-4 shadow-[0_0_30px_rgba(20,184,166,0.5),0_0_50px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.7),0_0_80px_rgba(236,72,153,0.5)] transition-shadow duration-300">
              ⚡ Powered by Perplexity AI & Nullshot
            </div>

            {/* Cyberpunk Hero Element with integrated title */}
            <Model3D modelPath="/model.glb" />

            {/* Particles and Text */}
            <div className="-mt-20 mb-8 relative z-20">
              <PredixParticles />
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mt-12">
              The first AI-agent powered prediction market interface.
              Trade with confidence using real-time insights and automated execution.
            </p>
          </div>

          {/* Fixed CTA Buttons - Left and Right Middle */}
          <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-between px-8">
            {/* Left Button - Launch Agent */}
            <HackerButton
              href="/chat"
              text="Launch Agent"
              className="pointer-events-auto px-10 py-5 bg-teal-500/5 backdrop-blur-lg border-2 border-teal-500/40 hover:bg-teal-500/10 hover:border-cyan-500/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.6),0_0_70px_rgba(6,182,212,0.4)] text-lg transition-all transform hover:scale-105"
              style={{ fontFamily: '"Ethnocentric", sans-serif' }}
            />

            {/* Right Button - View Markets */}
            <HackerButton
              href="/markets"
              text="View Markets"
              className="pointer-events-auto px-10 py-5 bg-teal-500/5 backdrop-blur-lg border-2 border-teal-500/40 hover:bg-teal-500/10 hover:border-cyan-500/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.6),0_0_70px_rgba(6,182,212,0.4)] text-lg transition-all transform hover:scale-105"
              style={{ fontFamily: '"Ethnocentric", sans-serif' }}
            />
          </div>

          {/* Floating Terminal Visual */}
          <div className="mt-20 relative max-w-4xl mx-auto animate-[float_6s_ease-in-out_infinite]">
            <div className="bg-teal-500/8 backdrop-blur-[20px] border-3 border-teal-500/60 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(20,184,166,0.3),0_0_20px_rgba(20,184,166,0.2)] hover:border-cyan-500/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.6),0_0_70px_rgba(6,182,212,0.4)] transition-all duration-300">
              <div className="flex items-center gap-4 mb-4 border-b border-teal-500/20 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <div className="ml-auto text-xs text-teal-400 font-mono">AI Agent Active</div>
              </div>
              <div className="space-y-4 text-left font-mono text-sm">
                <div className="flex gap-2">
                  <span className="text-teal-400">➜</span>
                  <span className="text-cyan-300">~</span>
                  <span className="text-gray-300">analyze market "Bitcoin 100k"</span>
                </div>
                <div className="pl-6 text-gray-400">
                  Analyzing market data... <br />
                  <span className="text-cyan-400">Confidence: 85%</span> <br />
                  Recommendation: <span className="text-teal-400">BUY YES</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Ticker */}
        <section className="py-10 border-y border-teal-500/20 bg-black/20 backdrop-blur-sm overflow-hidden pause-on-hover">
          <div className="animate-marquee whitespace-nowrap flex gap-10 items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-10 items-center">
                <span className="text-gray-400">BTC {'>'} $100k <span className="text-teal-400 ml-2">65%</span></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">ETH Flip BTC <span className="text-pink-400 ml-2">12%</span></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">Fed Rate Cut <span className="text-cyan-400 ml-2">89%</span></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">US GDP Growth <span className="text-teal-400 ml-2">2.4%</span></span>
                <span className="text-gray-600">|</span>
              </div>
            ))}
          </div>
        </section>


        {/* Features */}
        <section className="px-6 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl mb-4 font-black text-cyan-400" style={{
                textShadow: '0 1px 0 #0e7490, 0 2px 0 #0e7490, 0 3px 0 #0e7490, 0 4px 0 #0e7490, 0 5px 0 #0e7490, 0 6px 0 #0e7490, 0 7px 0 #0e7490, 0 8px 0 #0e7490, 0 9px 0 #0e7490, 0 10px 10px rgba(0,0,0,0.4), 0 0 40px rgba(6,182,212,0.5)'
              }}>
                Why Trade with AI?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-teal-500/8 backdrop-blur-[20px] border-2 border-teal-500/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:shadow-[0_0_50px_rgba(20,184,166,0.7)] overflow-hidden relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/50 animate-[pulse-glow_2s_ease-in-out_infinite]">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">Instant Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Process millions of data points in seconds. Our agent analyzes news, sentiment, and market history to give you the edge.
                </p>
              </div>

              <div className="bg-teal-500/8 backdrop-blur-[20px] border-2 border-teal-500/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:shadow-[0_0_50px_rgba(20,184,166,0.7)] overflow-hidden relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 animate-[pulse-glow_2s_ease-in-out_0.5s_infinite]">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-teal-400">Data-Driven</h3>
                <p className="text-gray-400 leading-relaxed">
                  No more guessing. Get probability-based recommendations backed by real-time Polymarket liquidity and volume data.
                </p>
              </div>

              <div className="bg-teal-500/8 backdrop-blur-[20px] border-2 border-teal-500/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_50px_rgba(236,72,153,0.5)] hover:shadow-[0_0_80px_rgba(236,72,153,0.7)] overflow-hidden relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-magenta-600 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 animate-[pulse-glow_2s_ease-in-out_1s_infinite]">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-400">Secure Execution</h3>
                <p className="text-gray-400 leading-relaxed">
                  Non-custodial trading. You sign every transaction. Your funds never leave your wallet until you say so.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CircuitBoardLayout>
  );
}
