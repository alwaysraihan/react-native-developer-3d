"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, Suspense, useState } from "react";
import { motion } from "motion/react";
import { Group } from "three";

type ModelProps = {
  onLoaded?: () => void;
};

function Model({ onLoaded }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/raihan/scene.gltf") as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (animations && animations.length) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixerRef.current!.clipAction(clip).play();
      });
    }
    if (onLoaded) onLoaded();
  }, [animations, scene, onLoaded]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  return (
    <group ref={groupRef}>
      {/* Top 3D Text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Top React Native Developer
      </Text>

      {/* 3D Model */}
      <primitive object={scene} scale={0.7} position={[0, -1, 0]} />

      {/* Bottom 3D Text */}
      <Text
        position={[0, -2.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        🚀 React Native Expert
      </Text>
    </group>
  );
}

export default function Home() {
  const [modelLoaded, setModelLoaded] = useState(false);

  return (
    <main className="relative h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* 3D Model with Texts */}
      <div className="relative w-full h-full flex items-center justify-center">
        {!modelLoaded && (
          <div className="absolute flex flex-col items-center justify-center z-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Loading 3D Magic...</p>
          </div>
        )}
        <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <motion.group
              initial={{ opacity: 0 }}
              animate={{ opacity: modelLoaded ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <Model onLoaded={() => setModelLoaded(true)} />
            </motion.group>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Hire Me Button */}
      <motion.button
  onClick={() => window.location.href = 'mailto:dev.nurulislam@gmail.com'}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-10 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-10"
      >
        Hire Me
      </motion.button>
    </main>
  );
}
