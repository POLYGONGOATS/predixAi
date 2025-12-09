'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

interface HackerButtonProps {
    href?: string;
    text: string;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    disableAnimation?: boolean;
}

export default function HackerButton({ href, text, className, onClick, style, disableAnimation = false }: HackerButtonProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startAnimation = () => {
        if (disableAnimation) return;

        let iteration = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return LETTERS[Math.floor(Math.random() * LETTERS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 3;
        }, 30);
    };

    // Cyberpunk polygon shape
    const polygonStyle = {
        clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
        fontFamily: '"PerfectDark", sans-serif',
        ...style
    };

    const commonProps = {
        className: `${className} relative overflow-hidden`,
        onMouseEnter: startAnimation,
        style: polygonStyle,
        onClick
    };

    if (href) {
        return (
            <Link href={href} {...commonProps}>
                {displayText}
            </Link>
        );
    }

    return (
        <button {...commonProps}>
            {displayText}
        </button>
    );
}
