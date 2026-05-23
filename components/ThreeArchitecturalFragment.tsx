"use client";

import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

function ArchitecturalFragment() {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/villa.glb");

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!meshRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(meshRef.current!.rotation, {
        y: Math.PI * 2,
        x: Math.PI * 0.1,
        z: -Math.PI * 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: "#craft",
          start: "top top",
          end: "+=400%",
          scrub: 1,
        }
      });

      gsap.to(meshRef.current!.scale, {
        x: 6,
        y: 6,
        z: 6,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#craft",
          start: "top top",
          end: "+=400%",
          scrub: 1,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <group ref={meshRef} scale={[4, 4, 4]}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function RenderController() {
  const { gl } = useThree();
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = gl.domElement;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    const section = document.getElementById("craft");
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, [gl]);

  useFrame(({ gl: renderer }) => {
    if (!isVisibleRef.current) {
      renderer.clear();
      return;
    }
  });

  return null;
}

export default function ThreeArchitecturalFragment() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [5, 4, 7], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        frameloop="always"
      >
        <fog attach="fog" args={["#F5F1E8", 8, 25]} />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          color="#FFFAF0"
        />
        <directionalLight position={[-10, 5, -5]} intensity={0.4} color="#E8DCD0" />

        <Suspense fallback={null}>
          <ArchitecturalFragment />
        </Suspense>
        
        <RenderController />
      </Canvas>
    </div>
  );
}
