"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Anglerfish body shader
const anglerfishVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float u_time;

  void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    // Subtle breathing animation
    vec3 pos = position;
    float breathe = sin(u_time * 0.8) * 0.02;
    pos *= 1.0 + breathe;

    // Tail wiggle
    float tailFactor = smoothstep(-0.5, 0.5, position.x);
    pos.y += sin(u_time * 2.0 + position.x * 3.0) * 0.05 * tailFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const anglerfishFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float u_time;

  void main() {
    // Deep sea dark blue/black color
    vec3 baseColor = vec3(0.02, 0.03, 0.08);

    // Subtle rim lighting (bioluminescence reflection)
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
    rim = pow(rim, 3.0);

    vec3 rimColor = vec3(0.1, 0.2, 0.4) * rim * 0.5;

    // Final color
    vec3 color = baseColor + rimColor;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Lure (bioluminescent light) shader
const lureVertexShader = `
  varying vec2 vUv;
  uniform float u_time;

  void main() {
    vUv = uv;

    // Swaying motion for the lure
    vec3 pos = position;
    pos.x += sin(u_time * 1.5) * 0.1;
    pos.y += cos(u_time * 1.2) * 0.05;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const lureFragmentShader = `
  varying vec2 vUv;
  uniform float u_time;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);

    // Pulsing glow
    float pulse = 0.8 + 0.2 * sin(u_time * 3.0);

    // Core bright light
    float core = smoothstep(0.5, 0.0, dist) * pulse;

    // Outer glow
    float glow = smoothstep(0.8, 0.0, dist) * 0.5 * pulse;

    // Bioluminescent blue-green color
    vec3 coreColor = vec3(0.4, 0.9, 1.0);
    vec3 glowColor = vec3(0.2, 0.6, 0.8);

    vec3 color = coreColor * core + glowColor * glow;
    float alpha = core + glow * 0.5;

    gl_FragColor = vec4(color, alpha);
  }
`;

// Particles for ambient deep sea effect
function DeepSeaParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#1a3a5c"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Anglerfish mesh
function AnglerfishMesh() {
  const bodyRef = useRef<THREE.Mesh>(null);
  const lureRef = useRef<THREE.Mesh>(null);
  const stalkRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const bodyUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
    }),
    []
  );

  const lureUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    bodyUniforms.u_time.value = time;
    lureUniforms.u_time.value = time;

    // Gentle floating motion
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main body - elongated sphere */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <shaderMaterial
          vertexShader={anglerfishVertexShader}
          fragmentShader={anglerfishFragmentShader}
          uniforms={bodyUniforms}
        />
      </mesh>

      {/* Tail section */}
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <shaderMaterial
          vertexShader={anglerfishVertexShader}
          fragmentShader={anglerfishFragmentShader}
          uniforms={bodyUniforms}
        />
      </mesh>

      {/* Lure stalk (illicium) */}
      <mesh ref={stalkRef} position={[-0.5, 0.6, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.01, 0.8, 8]} />
        <meshBasicMaterial color="#0a1520" />
      </mesh>

      {/* Bioluminescent lure (esca) */}
      <mesh ref={lureRef} position={[-0.7, 1.0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <shaderMaterial
          vertexShader={lureVertexShader}
          fragmentShader={lureFragmentShader}
          uniforms={lureUniforms}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Lure glow (larger, more transparent) */}
      <mesh position={[-0.7, 1.0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#40a0c0"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Eye */}
      <mesh position={[-0.6, 0.2, 0.35]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.6, 0.2, -0.35]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Teeth (simple cones) */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[
            -0.75 + Math.random() * 0.1,
            -0.15 + (i % 2) * 0.3,
            -0.2 + i * 0.08,
          ]}
          rotation={[0, 0, i % 2 === 0 ? 0.3 : -0.3]}
        >
          <coneGeometry args={[0.03, 0.15, 4]} />
          <meshBasicMaterial color="#c0c0a0" />
        </mesh>
      ))}

      {/* Fins */}
      <mesh position={[0.3, 0.5, 0.4]} rotation={[0.5, 0, 0.3]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial color="#0a1520" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.3, 0.5, -0.4]} rotation={[-0.5, 0, 0.3]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial color="#0a1520" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Scene with lighting
function AnglerfishScene() {
  return (
    <>
      {/* Very dim ambient for deep sea */}
      <ambientLight intensity={0.05} color="#102030" />

      {/* Point light from the lure */}
      <pointLight
        position={[-0.7, 1.0, 0]}
        intensity={2}
        color="#40c0e0"
        distance={5}
        decay={2}
      />

      <AnglerfishMesh />
      <DeepSeaParticles />
    </>
  );
}

interface AnglerfishProps {
  className?: string;
}

export function Anglerfish({ className = "" }: AnglerfishProps) {
  return (
    <div className={`bg-black ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#010208"]} />
        <AnglerfishScene />
      </Canvas>
    </div>
  );
}

export default Anglerfish;
