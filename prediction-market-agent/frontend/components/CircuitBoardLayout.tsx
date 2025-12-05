// Reusable layout component with circuit board borders
export default function CircuitBoardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Background Image */}
            <div
                className="fixed inset-0"
                style={{
                    backgroundImage: `url(/background.png?t=${Date.now()})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: -5,
                }}
            />

            {/* Circuit Board Border Pattern */}
            <div className="fixed inset-0 pointer-events-none z-50">
                {/* Top Right Corner Circuit Pattern */}
                <svg className="absolute top-0 right-0 w-96 h-64" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Horizontal lines */}
                    <line x1="400" y1="80" x2="200" y2="80" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="400" y1="100" x2="220" y2="100" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="400" y1="120" x2="180" y2="120" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Vertical connecting lines */}
                    <line x1="200" y1="80" x2="200" y2="180" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="220" y1="100" x2="220" y2="160" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="180" y1="120" x2="180" y2="200" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Angled lines */}
                    <line x1="200" y1="180" x2="100" y2="180" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="220" y1="160" x2="120" y2="160" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="180" y1="200" x2="80" y2="200" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Circuit dots */}
                    <circle cx="200" cy="80" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="220" cy="100" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="180" cy="120" r="4" fill="#14b8a6" opacity="0.7" />
                    <circle cx="200" cy="180" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="220" cy="160" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="180" cy="200" r="4" fill="#14b8a6" opacity="0.7" />
                    <circle cx="100" cy="180" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="120" cy="160" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="80" cy="200" r="4" fill="#14b8a6" opacity="0.7" />

                    {/* Small decorative dots */}
                    <circle cx="350" cy="80" r="2" fill="#06b6d4" opacity="0.5" />
                    <circle cx="370" cy="100" r="2" fill="#06b6d4" opacity="0.5" />
                    <circle cx="330" cy="120" r="2" fill="#06b6d4" opacity="0.5" />
                </svg>

                {/* Top Left Corner Circuit Pattern */}
                <svg className="absolute top-0 left-0 w-96 h-64" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Horizontal lines */}
                    <line x1="0" y1="80" x2="200" y2="80" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="0" y1="100" x2="180" y2="100" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="0" y1="120" x2="220" y2="120" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Vertical connecting lines */}
                    <line x1="200" y1="80" x2="200" y2="180" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="180" y1="100" x2="180" y2="160" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="220" y1="120" x2="220" y2="200" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Circuit dots */}
                    <circle cx="200" cy="80" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="180" cy="100" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="220" cy="120" r="4" fill="#14b8a6" opacity="0.7" />
                    <circle cx="200" cy="180" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="180" cy="160" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="220" cy="200" r="4" fill="#14b8a6" opacity="0.7" />
                </svg>

                {/* Bottom Right Corner Circuit Pattern */}
                <svg className="absolute bottom-0 right-0 w-96 h-64" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Lines from bottom */}
                    <line x1="400" y1="170" x2="200" y2="170" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="400" y1="150" x2="220" y2="150" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="400" y1="130" x2="180" y2="130" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Vertical lines */}
                    <line x1="200" y1="170" x2="200" y2="70" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="220" y1="150" x2="220" y2="90" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />

                    {/* Circuit dots */}
                    <circle cx="200" cy="170" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="220" cy="150" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="180" cy="130" r="4" fill="#14b8a6" opacity="0.7" />
                </svg>

                {/* Bottom Left Corner Circuit Pattern */}
                <svg className="absolute bottom-0 left-0 w-96 h-64" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Lines from bottom */}
                    <line x1="0" y1="170" x2="200" y2="170" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="0" y1="150" x2="180" y2="150" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />
                    <line x1="0" y1="130" x2="220" y2="130" stroke="#14b8a6" strokeWidth="2" opacity="0.5" />

                    {/* Vertical lines */}
                    <line x1="200" y1="170" x2="200" y2="70" stroke="#14b8a6" strokeWidth="2" opacity="0.6" />
                    <line x1="180" y1="150" x2="180" y2="90" stroke="#14b8a6" strokeWidth="2" opacity="0.4" />

                    {/* Circuit dots */}
                    <circle cx="200" cy="170" r="4" fill="#14b8a6" opacity="0.8" />
                    <circle cx="180" cy="150" r="4" fill="#14b8a6" opacity="0.6" />
                    <circle cx="220" cy="130" r="4" fill="#14b8a6" opacity="0.7" />
                </svg>
            </div>

            {/* Page Content */}
            {children}
        </div>
    );
}
