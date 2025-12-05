'use client';

export default function GlitchText({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`glitch-text ${className}`}>
            {children}
        </div>
    );
}
