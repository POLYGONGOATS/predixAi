'use client';

export default function CyberpunkHero() {
    return (
        <div className="relative w-full max-w-2xl mx-auto h-[500px] flex items-center justify-center effect-3d">
            {/* Golden Triangle - More Prominent */}
            <div
                className="absolute w-[450px] h-[450px] floating"
                style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    border: '4px solid #fbbf24',
                    boxShadow: `
                        0 0 40px rgba(251, 191, 36, 0.6),
                        0 0 80px rgba(251, 191, 36, 0.4),
                        inset 0 0 40px rgba(251, 191, 36, 0.2)
                    `,
                    animationDuration: '8s',
                    background: 'transparent'
                }}
            />

            {/* 3D Glossy Shape (CSS-based) */}
            <div className="relative z-10">
                {/* Main glossy blob */}
                <div className="relative w-64 h-64">
                    {/* Base shape */}
                    <div className="absolute inset-0 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] bg-gradient-to-br from-pink-500 via-purple-600 to-magenta-600 animate-pulse"
                        style={{
                            boxShadow: `
                0 0 60px rgba(236, 72, 153, 0.6),
                0 0 100px rgba(168, 85, 247, 0.4),
                inset 0 0 60px rgba(255, 255, 255, 0.2)
              `,
                            filter: 'brightness(1.2) contrast(1.1)',
                            animation: 'float 6s ease-in-out infinite, morph 8s ease-in-out infinite'
                        }}
                    />

                    {/* Glossy highlight */}
                    <div className="absolute top-8 left-12 w-24 h-24 rounded-full bg-white/40 blur-2xl" />

                    {/* Additional organic shapes */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-pink-400 to-purple-500"
                        style={{
                            boxShadow: '0 0 40px rgba(236, 72, 153, 0.5)',
                            filter: 'brightness(1.3)',
                            animation: 'float 5s ease-in-out infinite reverse'
                        }}
                    />

                    <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] bg-gradient-to-br from-purple-500 to-magenta-600"
                        style={{
                            boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
                            filter: 'brightness(1.2)',
                            animation: 'float 7s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
        @keyframes morph {
          0%, 100% {
            border-radius: 40% 60% 70% 30% / 60% 30% 70% 40%;
          }
          25% {
            border-radius: 60% 40% 30% 70% / 40% 70% 30% 60%;
          }
          50% {
            border-radius: 30% 70% 60% 40% / 70% 40% 60% 30%;
          }
          75% {
            border-radius: 70% 30% 40% 60% / 30% 60% 40% 70%;
          }
        }
      `}</style>
        </div>
    );
}
