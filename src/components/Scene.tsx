import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Clouds,
  Cloud,
  Sky as SkyImpl,
  StatsGl,
  Stars,
  CameraControls,
} from "@react-three/drei";
import { Mountain } from "./Mountain";
import { Reactor } from "./Reactor";

function ScrollCamera() {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, -60, 40));
  const targetRotation = useRef(new THREE.Euler(0.78, 0, 0));
  const initialized = useRef(false);

  // Mouse parallax
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);

  useEffect(() => {
    // Set initial camera rotation immediately
    if (!initialized.current) {
      camera.rotation.set(0.78, 0, 0);
      initialized.current = true;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Camera moves within 0vh to 100vh scroll range
      const endScroll = viewportHeight; // 100vh

      // Calculate progress (0 to 1) based on scroll position
      const progress = Math.min(Math.max(scrollY / endScroll, 0), 1);

      // Move camera back (increase z) as user scrolls down
      targetPosition.current.set(
        0,
        -60 + progress * -120, // y: -200 to -150 (move up)
        40 + progress * 160 // z: 200 to 300 (move back)
      );

      // Rotate camera as user scrolls (slight tilt up)
      targetRotation.current.set(
        0.78 + progress * -0.2, // x rotation: 0.78 to 0.93 (бага зэрэг дээш эргэнэ)
        0,
        0
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Mouse position-ийг -1-ээс 1 хүртэл normalize хийнэ
      targetMouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera]);

  useFrame(() => {
    // Mouse position-ийг smooth-аар дагана
    mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
    mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, 0.1);

    // Mouse-аас хамааруулж камерыг хөдөлгөнө
    camera.position.x += mouseX.current * 0.5; // Хажуу тийш хөдөлнө
    camera.position.y += mouseY.current * 0.3; // Дээш/доош хөдөлнө

    // Smoothly interpolate camera rotation
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.1;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.1;
    camera.rotation.z += (targetRotation.current.z - camera.rotation.z) * 0.1;

    // Mouse-аас хамааруулж камерын эргэлтийг нэмнэ
    camera.rotation.y += mouseX.current * -0.008; // Хажуу тийш эргэнэ
    camera.rotation.x += mouseY.current * -0.005; // Дээш/доош эргэнэ
  });

  return null;
}

export const Scene = () => {
  return (
    <>
      <ScrollCamera />
      <Mountain />
      {/* <CameraControls /> */}
      {/* <Reactor /> */}
      <Stars
        radius={12}
        depth={100}
        count={8000}
        factor={8}
        saturation={0}
        fade
        speed={1}
      />

      <StatsGl />
      <Sky />
      {/* Ambient light - бага зэрэг dark */}
      <ambientLight intensity={0.8} color="#c8d4e0" />
      {/* Нарны гэрэл - дээрээс */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.8}
        color="#ffeedd"
        castShadow
      />
      {/* Тэнгэрийн тусгал - доороос */}
      <hemisphereLight color="#8ab4d0" groundColor="#6b5345" intensity={0.9} />
      {/* Rim light - хөх өнгөтэй */}
      <spotLight
        position={[-30, 20, 30]}
        color="#a8c8e0"
        angle={0.3}
        decay={0}
        penumbra={1}
        intensity={25}
      />
      <spotLight
        position={[30, 10, 20]}
        color="#b8d4e8"
        angle={0.3}
        decay={0}
        penumbra={1}
        intensity={20}
      />
    </>
  );
};

function Sky() {
  const ref = useRef<THREE.Group>(null);
  const cloud0 = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current || !cloud0.current) return;
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 10) * 0.05;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 10) * 0.05;
    cloud0.current.rotation.y -= delta * 0.03;
  });

  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshBasicMaterial} limit={400} range={400}>
          <Cloud
            ref={cloud0}
            concentrate="outside"
            growth={30}
            color="#ffffff"
            opacity={1.8}
            seed={2}
            bounds={[300, 150, 300]}
            volume={200}
            segments={60}
            speed={0.01}
            fade={800}
          />
        </Clouds>
      </group>
    </>
  );
}
