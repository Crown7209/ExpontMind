"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";

type Props = {
  imageUrl: string;
};

export default function ParticlePortrait({ imageUrl }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const texture = useLoader(THREE.TextureLoader, imageUrl);

  const { positions, linePositions } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = texture.image as HTMLImageElement;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const scale = 1 / Math.max(canvas.width, canvas.height);
    const particles: THREE.Vector3[] = [];
    const points: number[] = [];
    const lines: number[] = [];

    const STEP = 5;
    const MAX_DIST = 0.09;

    // ---------- PARTICLES ----------
    for (let y = 0; y < canvas.height; y += STEP) {
      for (let x = 0; x < canvas.width; x += STEP) {
        const i = (y * canvas.width + x) * 4;
        const r = imgData[i];

        if (r < 90) {
          const px = (x - canvas.width / 2) * scale;
          const py = -(y - canvas.height / 2) * scale;
          const pz = (Math.random() - 0.5) * 0.05;

          const v = new THREE.Vector3(px, py, pz);
          particles.push(v);
          points.push(v.x, v.y, v.z);
        }
      }
    }

    // ---------- NEAREST NEIGHBOR LINES ----------
    for (let i = 0; i < particles.length; i++) {
      let nearestDist = Infinity;
      let nearestIndex = -1;

      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;

        const d = particles[i].distanceTo(particles[j]);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIndex = j;
        }
      }

      if (
        nearestIndex !== -1 &&
        nearestDist < MAX_DIST &&
        Math.random() > 0.35 // 🔥 зарим нь утасгүй
      ) {
        const a = particles[i];
        const b = particles[nearestIndex];
        lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }

    return {
      positions: new Float32Array(points),
      linePositions: new Float32Array(lines),
    };
  }, [texture]);

  useFrame(({ mouse }) => {
    const rx = mouse.y * 0.12;
    const ry = mouse.x * 0.12;

    if (pointsRef.current) {
      pointsRef.current.rotation.x = rx;
      pointsRef.current.rotation.y = ry;
    }
    if (linesRef.current) {
      linesRef.current.rotation.x = rx;
      linesRef.current.rotation.y = ry;
    }
  });

  return (
    <>
      {/* SOFT DOTS */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>

        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{
            uSize: { value: 18 },
            uColor: { value: new THREE.Color("#111") },
          }}
          vertexShader={`
            uniform float uSize;
            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = uSize * (1.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            void main() {
              float d = distance(gl_PointCoord, vec2(0.5));
              float alpha = smoothstep(0.5, 0.2, d);
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </points>

      {/* LINES */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#111" transparent opacity={0.035} />
      </lineSegments>
    </>
  );
}
