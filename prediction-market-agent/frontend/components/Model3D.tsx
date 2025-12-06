'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ modelPath, mousePosition }: { modelPath: string; mousePosition: { x: number; y: number } }) {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Object3D | null>(null);
    const spineRef = useRef<THREE.Object3D | null>(null);
    const [bonesSearched, setBonesSearched] = useState(false);

    // Find head and spine bones on mount
    if (!bonesSearched && scene) {
        console.log('🔍 Searching for bones in model...');
        scene.traverse((child) => {
            // Log all bone/object names for debugging
            if (child.type === 'Bone' || child.type === 'Object3D' || child.type === 'SkinnedMesh') {
                console.log('Found:', child.name, '| Type:', child.type);
            }

            const nameLower = child.name.toLowerCase();

            // Common bone names for head
            if (nameLower.includes('head') ||
                nameLower.includes('neck') ||
                nameLower.includes('skull')) {
                headRef.current = child;
                console.log('✅ Head bone found:', child.name);
            }
            // Common bone names for spine/torso
            if (nameLower.includes('spine') ||
                nameLower.includes('chest') ||
                nameLower.includes('torso') ||
                nameLower.includes('upper')) {
                if (!spineRef.current) {
                    spineRef.current = child;
                    console.log('✅ Spine bone found:', child.name);
                }
            }
        });

        if (!headRef.current && !spineRef.current) {
            console.log('⚠️ No specific bones found. Will rotate entire model instead.');
        }

        setBonesSearched(true);
    }

    useFrame(() => {
        const targetRotationX = -mousePosition.y * 0.2;
        const targetRotationY = mousePosition.x * 0.3;

        // If we found specific bones, rotate them
        if (headRef.current || spineRef.current) {
            // Rotate head to follow mouse
            if (headRef.current) {
                headRef.current.rotation.x = THREE.MathUtils.lerp(
                    headRef.current.rotation.x,
                    targetRotationX * 1.5,
                    0.1
                );
                headRef.current.rotation.y = THREE.MathUtils.lerp(
                    headRef.current.rotation.y,
                    targetRotationY * 2,
                    0.1
                );
            }

            // Rotate spine/body slightly to follow mouse
            if (spineRef.current) {
                spineRef.current.rotation.x = THREE.MathUtils.lerp(
                    spineRef.current.rotation.x,
                    targetRotationX * 0.8,
                    0.08
                );
                spineRef.current.rotation.y = THREE.MathUtils.lerp(
                    spineRef.current.rotation.y,
                    targetRotationY,
                    0.08
                );
            }
        }
        // Fallback: rotate entire model if no bones found
        else if (modelRef.current) {
            modelRef.current.rotation.x = THREE.MathUtils.lerp(
                modelRef.current.rotation.x,
                targetRotationX,
                0.1
            );
            modelRef.current.rotation.y = THREE.MathUtils.lerp(
                modelRef.current.rotation.y,
                targetRotationY,
                0.1
            );
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={0.6}
            position={[0, -2, 0]}
            rotation={[0, 0, 0]}
        />
    );
}

export default function Model3D({ modelPath = '/model.glb' }: { modelPath?: string }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setMousePosition({ x, y });
    };

    return (
        <div
            className="relative w-full max-w-2xl mx-auto h-[500px]"
            onMouseMove={handleMouseMove}
        >


            {/* 3D Model Canvas */}
            <div className="relative z-10 w-full h-full">
                <Canvas
                    camera={{ position: [0, 1, 12], fov: 50 }}
                    style={{ background: 'transparent' }}
                >
                    {/* Enhanced lighting for better visibility */}
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
                    <directionalLight position={[-5, -5, -5]} intensity={2} color="#14b8a6" />
                    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2.5} />
                    <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={2} color="#06b6d4" />
                    <pointLight position={[0, 10, 0]} intensity={2} color="#14b8a6" />
                    <pointLight position={[0, -10, 0]} intensity={1.5} color="#fbbf24" />

                    <Suspense fallback={null}>
                        <Model modelPath={modelPath} mousePosition={mousePosition} />
                    </Suspense>

                    <OrbitControls
                        enableZoom={false}
                        enableRotate={false}
                        enablePan={false}
                        minDistance={2}
                        maxDistance={15}
                    />
                </Canvas>
            </div>
        </div>
    );
}
