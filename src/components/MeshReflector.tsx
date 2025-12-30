"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import getUuid from "uuid-by-string";

const GOLDENRATIO = 1.61803398875;

interface ImageData {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

interface MeshReflectorProps {
  images: ImageData[];
}

export const MeshReflector = ({ images }: MeshReflectorProps) => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ fov: 70, position: [0, 2, 15] }}
    style={{ width: "100%", height: "100%" }}
  >
    <color attach="background" args={["#191920"]} />
    <fog attach="fog" args={["#191920", 0, 15]} />
    <group position={[0, -0.5, 0]}>
      <Frames images={images} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
    <Environment preset="city" />
  </Canvas>
);

interface FramesProps {
  images: ImageData[];
  q?: THREE.Quaternion;
  p?: THREE.Vector3;
}

function Frames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}: FramesProps) {
  const ref = useRef<THREE.Group>(null);
  const clicked = useRef<THREE.Object3D | undefined>(undefined);
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!ref.current) return;
    clicked.current = ref.current.getObjectByName(params?.id || "");
    if (clicked.current && clicked.current.parent) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setLocation(
          clicked.current === e.object ? "/" : "/item/" + e.object.name
        );
      }}
      onPointerMissed={() => setLocation("/")}
    >
      {images.map((props) => (
        <Frame key={props.url} {...props} />
      ))}
    </group>
  );
}

interface FrameProps extends ImageData {
  c?: THREE.Color;
}

function Frame({ url, ...props }: FrameProps) {
  const image = useRef<THREE.Mesh & { material: { zoom: number } }>(null);
  const frame = useRef<THREE.Mesh>(null);
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  const isActive = params?.id === name;

  useCursor(hovered);

  useFrame((state, dt) => {
    if (!image.current || !frame.current) return;

    image.current.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;

    easing.damp3(
      image.current.scale,
      [
        0.85 * (!isActive && hovered ? 0.85 : 1),
        0.9 * (!isActive && hovered ? 0.905 : 1),
        1,
      ],
      0.1,
      dt
    );

    easing.dampC(
      (frame.current.material as THREE.MeshBasicMaterial).color,
      hovered ? "orange" : "white",
      0.1,
      dt
    );
  });

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(true);
        }}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          raycast={() => null}
          ref={image as React.RefObject<THREE.Mesh>}
          position={[0, 0, 0.7]}
          url={url}
        />
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split("-").join(" ")}
      </Text>
    </group>
  );
}

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

export const defaultImages: ImageData[] = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1103970) },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  {
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(327482),
  },
  {
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(325185),
  },
  {
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(358574),
  },
  // Right
  {
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(227675),
  },
  {
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(911738),
  },
  {
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(1738986),
  },
];

export default MeshReflector;
