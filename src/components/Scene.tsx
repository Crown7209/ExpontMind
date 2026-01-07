import * as THREE from "three";
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Mountain } from "./Mountain";
import { Logo } from "./Logo";

interface SceneProps {
  startVP?: number; // Start viewport multiplier (default: 2)
  endVP?: number; // End viewport multiplier (default: 4)
}

// Logo that moves with scroll like camera
function AnimatedLogo({ startVP = 4, endVP = 8.5 }: SceneProps) {
  const logoRef = useRef<THREE.Group>(null);

  const initialY = 40;
  const initialZ = -32;

  useFrame(() => {
    if (!logoRef.current) return;

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    const startScroll = viewportHeight * startVP;
    const endScroll = viewportHeight * endVP;

    const progress = Math.min(
      Math.max((scrollY - startScroll) / (endScroll - startScroll), 0),
      1
    );

    // Logo moves similar to camera but stays in front of it
    const targetY = initialY + progress * -100;
    const targetZ = initialZ + progress * 80;

    // Smooth lerp
    logoRef.current.position.y += (targetY - logoRef.current.position.y) * 0.1;
    logoRef.current.position.z += (targetZ - logoRef.current.position.z) * 0.1;
  });

  return (
    <group ref={logoRef} position={[0, initialY, initialZ]}>
      <Logo scale={8} rotation={[-Math.PI / 4, 0, 0]} />
    </group>
  );
}

function ScrollCamera({ startVP = 4, endVP = 8.5 }: SceneProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotation = useRef(new THREE.Euler(0.78, -0.18, 0));
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

      // Dynamic start/end based on props
      const startScroll = viewportHeight * startVP;
      const endScroll = viewportHeight * endVP;

      // Calculate progress (0 to 1) based on scroll position
      const progress = Math.min(
        Math.max((scrollY - startScroll) / (endScroll - startScroll), 0),
        1
      );

      // Move camera back (increase z) as user scrolls down
      targetPosition.current.set(
        0,
        0 + progress * -200, // y: -100 to -180 (move up)
        0 + progress * 200 // z: 60 to 200 (move back)
      );

      // Rotate camera as user scrolls (slight tilt up)
      targetRotation.current.set(
        0.78 + progress * -0.2, // x rotation: 0.78 to 0.93 (бага зэрэг дээш эргэнэ)
        -0.18,
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
    camera.rotation.y += mouseX.current * -0.005; // Хажуу тийш эргэнэ
    camera.rotation.x += mouseY.current * -0.005; // Дээш/доош эргэнэ
  });

  return null;
}

export const Scene = (props: SceneProps) => {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      resize={{ scroll: false, debounce: { scroll: 100, resize: 0 } }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, -180, 100], fov: 45 }}
    >
      <ScrollCamera {...props} />

      <AnimatedLogo {...props} />

      <Mountain />

      <Stars
        radius={100}
        depth={120}
        count={8000}
        factor={15}
        saturation={0}
        fade
        speed={1}
      />

      <ambientLight intensity={0.01} color="#ffffff" />

      <hemisphereLight color="#707070" groundColor="#000000" intensity={0.3} />

      <spotLight
        position={[0, -50, 30]}
        color="#ffffff"
        angle={0.3}
        decay={0.6}
        penumbra={1}
        intensity={12}
      />
      <spotLight
        position={[0, -50, 30]}
        color="#ffffff"
        angle={0.2}
        decay={0.5}
        penumbra={1}
        intensity={12}
      />

      <spotLight
        position={[0, 10, 120]}
        color="#ffffff"
        angle={0.5}
        decay={0.8}
        penumbra={1}
        intensity={15}
      />
      <spotLight
        position={[0, 10, 120]}
        color="#ffffff"
        angle={0.4}
        decay={0.6}
        penumbra={1}
        intensity={15}
      />
      <spotLight
        position={[0, 10, 120]}
        color="#ffffff"
        angle={0.3}
        decay={0.5}
        penumbra={1}
        intensity={15}
      />
      <spotLight
        position={[0, 10, 120]}
        color="#ffffff"
        angle={0.2}
        decay={0.4}
        penumbra={1}
        intensity={15}
      />
    </Canvas>
  );
};
