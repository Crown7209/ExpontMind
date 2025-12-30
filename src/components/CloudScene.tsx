"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const cloudShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec2 vUv;

    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep( fogNear, fogFar, depth );

      gl_FragColor = texture2D( map, vUv );
      gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
      gl_FragColor = mix( gl_FragColor, vec4( fogColor , gl_FragColor.w ), fogFactor );
    }
  `,
};

function CloudMesh({ texture }: { texture: THREE.Texture }) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useRef(0);
  const targetY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);
  const { camera } = useThree();

  const fog = useMemo(() => new THREE.Fog(0xffffff, -500, 3000), []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        fogColor: { value: fog.color },
        fogNear: { value: fog.near },
        fogFar: { value: fog.far },
      },
      vertexShader: cloudShader.vertexShader,
      fragmentShader: cloudShader.fragmentShader,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });
  }, [texture, fog]);

  const geometry = useMemo(() => {
    const planeGeo = new THREE.PlaneGeometry(64, 64);
    const planeObj = new THREE.Object3D();
    const geometries: THREE.BufferGeometry[] = [];

    for (let i = 0; i < 10000; i++) {
      planeObj.position.x = Math.random() * 1000 - 500;
      planeObj.position.y = -Math.random() * Math.random() * 1000 - 80;
      planeObj.position.z = i;
      planeObj.rotation.z = Math.random() * Math.PI;
      planeObj.scale.x = planeObj.scale.y =
        Math.random() * Math.random() * 1.5 + 0.5;
      planeObj.updateMatrix();

      const clonedPlaneGeo = planeGeo.clone();
      clonedPlaneGeo.applyMatrix4(planeObj.matrix);
      geometries.push(clonedPlaneGeo);
    }

    return BufferGeometryUtils.mergeGeometries(geometries);
  }, []);

  useEffect(() => {
    camera.position.set(0, 0, 1000);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Cloud 30vh-аас эхэлж аажим дээшилнэ, 350vh-д бүрэн алга болно
      const cloudStartScroll = windowHeight * 1;
      const cloudEndScroll = windowHeight * 5;

      if (scrollY < cloudStartScroll) {
        scrollProgress.current = 0;
      } else {
        scrollProgress.current = Math.min(
          (scrollY - cloudStartScroll) / (cloudEndScroll - cloudStartScroll),
          1
        );
      }
      // Scroll доошлоход үүлс дээшлэнэ (y нэмэгдэнэ)
      targetY.current = scrollProgress.current * 2000;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Mouse position-ийг -1-ээс 1 хүртэл normalize хийнэ
      targetMouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Mouse position-ийг smooth-аар дагана
    mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
    mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

    if (groupRef.current) {
      // Үүлсийг дээшлүүлнэ - scroll доошлоход үүлс дээш явна
      groupRef.current.position.y +=
        (targetY.current - groupRef.current.position.y) * 0.1;

      // Автомат хөдөлгөөн - бага зэрэг хэлбэлзэх
      const idleX = Math.sin(time * 0.3) * 8; // Хажуу тийш аажим
      const idleY = Math.cos(time * 0.2) * 3; // Дээш доош аажим
      const idleRotY = Math.sin(time * 0.15) * 0.01; // Бага зэрэг эргэх

      // Mouse-ийн байрлал + idle хөдөлгөөн
      groupRef.current.position.x = mouseX.current * -30 + idleX;
      groupRef.current.position.z = idleY;
      groupRef.current.rotation.y = mouseX.current * 0.02 + idleRotY;
      groupRef.current.rotation.x = mouseY.current * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={material} renderOrder={2} />
      <mesh
        geometry={geometry}
        material={material}
        position={[0, 0, -8000]}
        renderOrder={1}
      />
    </group>
  );
}

function CloudSceneContent() {
  const textureRef = useRef<THREE.Texture | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        textureRef.current = texture;
        setLoaded(true);
      }
    );
  }, []);

  if (!loaded || !textureRef.current) {
    return null;
  }

  return <CloudMesh texture={textureRef.current} />;
}

import { useState } from "react";

export function CloudScene() {
  return (
    <Canvas
      className="absolute! inset-0 w-full h-full"
      camera={{
        fov: 30,
        near: 1,
        far: 3000,
        position: [0, 0, 6000],
      }}
      gl={{
        antialias: false,
        alpha: true,
      }}
    >
      <fog attach="fog" args={[0xffffff, -500, 3000]} />
      <CloudSceneContent />
    </Canvas>
  );
}
