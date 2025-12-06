'use client';

import { useState, useRef, useEffect } from 'react';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

interface HackerTextProps {
    text: string;
    className?: string;
    speed?: number;
}

export default function HackerText({ text, className, speed = 30 }: HackerTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    const startAnimation = () => {
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
        }, speed);
    };

    // Animate on mount
    useEffect(() => {
        if (!hasAnimated) {
            startAnimation();
            setHasAnimated(true);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text]);

    return (
        <span
            className={className}
            onMouseEnter={startAnimation}
            style={{ fontFamily: '"PerfectDark", sans-serif' }}
        >
            {displayText}
        </span>
    );
}
