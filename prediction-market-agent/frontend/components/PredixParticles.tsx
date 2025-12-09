'use client';

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

export default function PredixParticles() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // console.log(container);
    }, []);

    return (
        <div className="relative w-full h-[160px] flex items-center justify-center overflow-hidden">
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                className="absolute inset-0"
                options={{
                    fullScreen: { enable: false },
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: false,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "grab", // Connect particles to cursor
                            },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 4,
                            },
                            grab: {
                                distance: 140,
                                links: {
                                    opacity: 0.5,
                                },
                            },
                            repulse: {
                                distance: 100,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#22d3ee", // Cyan-400
                        },
                        links: {
                            color: "#0891b2", // Cyan-600
                            distance: 120,
                            enable: true,
                            opacity: 0.2,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 0.8, // Slower, more elegant movement
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80, // More particles for a denser network
                        },
                        opacity: {
                            value: 0.3,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 2 },
                        },
                    },
                    detectRetina: true,
                }}
            />

            {/* Professional 3D Text Effect */}
            <h1 className="relative z-10 text-5xl md:text-7xl font-bold tracking-widest select-none bg-gradient-to-br from-sky-200 via-cyan-400 to-cyan-700 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                style={{
                    fontFamily: '"PerfectDark", sans-serif',
                }}
            >
                PREDIX AI
            </h1>
        </div>
    );
}
