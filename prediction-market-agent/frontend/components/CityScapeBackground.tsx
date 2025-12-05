'use client';

export default function CityScapeBackground() {
    return (
        <div className="fixed inset-0" style={{ zIndex: -10 }}>
            {/* Very transparent dark teal gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a1f]/20 via-transparent to-[#0a1a1f]/20" />

            {/* Animated grid overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                    backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />
        </div>
    );
}
