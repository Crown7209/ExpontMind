"use client";

import * as THREE from "three";
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Environment,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { easing } from "maath";

// Check if mobile for performance optimizations
const isMobile =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const PageScrollContext = createContext<{ scrollProgress: number }>({
  scrollProgress: 0,
});

const GOLDENRATIO = 1.61803398875;

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const imageUrls = [
  pexel(1103970),
  pexel(416430),
  pexel(310452),
  pexel(327482),
  pexel(325185),
  pexel(358574),
  pexel(227675),
  pexel(911738),
  pexel(1738986),
];

const ClickedContext = createContext<{
  clicked: string | null;
  setClicked: (id: string | null) => void;
}>({ clicked: null, setClicked: () => {} });

interface GalleryProps {
  usePageScroll?: boolean;
}

function Gallery({ usePageScroll = false }: GalleryProps) {
  const ref = useRef<THREE.Group>(null);
  const scroll = usePageScroll ? null : useScroll();
  const { clicked } = useContext(ClickedContext);
  const { scrollProgress } = useContext(PageScrollContext);
  // Дарсан үеийн scroll offset хадгалах
  const savedOffset = useRef(0);
  // Өмнө нь clicked байсан эсэх (буцах animation-д хэрэглэнэ)
  const wasClicked = useRef(false);
  // Буцах animation дуусах хүртэл хүлээх
  const isReturning = useRef(false);

  const targetZ = 9;

  useFrame((_state, dt) => {
    if (!ref.current) return;

    // Page scroll эсвэл drei scroll ашиглах
    const currentOffset = usePageScroll ? scrollProgress : scroll?.offset ?? 0;

    if (clicked) {
      // Clicked state руу орлоо
      wasClicked.current = true;
      isReturning.current = false;

      // Дарсан mesh-ийн index олох
      const clickedIndex = parseInt(clicked.split("-")[1]);
      // Тухайн mesh-ийн анхны Z position
      const meshOriginalZ = -clickedIndex * 25;
      // Group-ийг хөдөлгөж mesh-ийг camera урд авчрах
      const targetGroupZ = targetZ - meshOriginalZ;
      // Mesh дээр дарахад smooth animation (0.5)
      easing.damp3(
        ref.current.position,
        [-9, 1.2, targetGroupZ], // [x, y, z]
        0.5,
        dt
      );
    } else if (wasClicked.current) {
      // Clicked-ээс гарч байна - smooth буцах animation
      isReturning.current = true;
      const targetPos = [0, 0, savedOffset.current * 200] as [
        number,
        number,
        number
      ];

      // Smooth буцах (0.5)
      easing.damp3(ref.current.position, targetPos, 0.5, dt);

      // Буцах animation дуусвал wasClicked-ийг false болгох
      const distance =
        Math.abs(ref.current.position.x - targetPos[0]) +
        Math.abs(ref.current.position.y - targetPos[1]) +
        Math.abs(ref.current.position.z - targetPos[2]);
      if (distance < 0.1) {
        wasClicked.current = false;
        isReturning.current = false;
      }
    } else {
      // Энгийн scroll (0.1 delay)
      savedOffset.current = currentOffset;
      easing.damp3(
        ref.current.position,
        [0, 0, currentOffset * 200], // [x, y, z]
        0.1,
        dt
      );
    }
  });

  return (
    <group ref={ref}>
      {imageUrls.map((url, index) => (
        <Frame
          key={url}
          url={url}
          index={index}
          position={[0, 0, -index * 25]}
          rotation={[0, -Math.PI / 4, 0] as [number, number, number]}
        />
      ))}
    </group>
  );
}

interface FrameProps {
  url: string;
  index: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}

function Frame({ url, index, position, rotation = [0, 0, 0] }: FrameProps) {
  const image = useRef<THREE.Mesh & { material: { zoom: number } }>(null);
  const frame = useRef<THREE.Mesh>(null);
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const { clicked, setClicked } = useContext(ClickedContext);
  const name = `frame-${index}`;
  const isActive = clicked === name;

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
    <group position={position} rotation={rotation}>
      <mesh
        name={name}
        onClick={(e) => {
          e.stopPropagation();
          setClicked(isActive ? null : name);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(true);
        }}
        onPointerOut={() => hover(false)}
        scale={[6, GOLDENRATIO * 6, 0.05]}
        position={[0, (GOLDENRATIO * 6) / 2, 0]}
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
    </group>
  );
}

interface SceneProps {
  usePageScroll?: boolean;
}

function Scene({ usePageScroll = false }: SceneProps) {
  const [clicked, setClicked] = useState<string | null>(null);

  const content = (
    <group position={[0, -4, 0]} onPointerMissed={() => setClicked(null)}>
      <Gallery usePageScroll={usePageScroll} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={isMobile ? [100, 50] : [200, 80]}
          resolution={isMobile ? 512 : 1024}
          mixBlur={1}
          mixStrength={isMobile ? 40 : 60}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </group>
  );

  return (
    <ClickedContext.Provider value={{ clicked, setClicked }}>
      {usePageScroll ? (
        content
      ) : (
        <ScrollControls pages={4} enabled={clicked === null}>
          {content}
        </ScrollControls>
      )}
      <Environment preset="city" />
    </ClickedContext.Provider>
  );
}

interface TrainSceneProps {
  usePageScroll?: boolean;
  scrollProgress?: number;
}

export default function TrainScene({
  usePageScroll = false,
  scrollProgress = 0,
}: TrainSceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Lazy load with IntersectionObserver - load when near viewport
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
        } else if (hasLoaded) {
          // Keep mounted but pause rendering when out of view
          setIsVisible(false);
        }
      },
      {
        rootMargin: "300px", // Start loading 300px before visible
        threshold: 0,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasLoaded]);

  return (
    <div ref={observerRef} className="sticky top-0 h-screen w-full">
      {hasLoaded ? (
        <PageScrollContext.Provider value={{ scrollProgress }}>
          <Canvas
            dpr={isMobile ? 1 : [1, 1.5]}
            shadows={!isMobile}
            camera={{ position: [-20, 5, 20], fov: 35 }}
            gl={{
              alpha: false,
              antialias: !isMobile,
              powerPreference: "high-performance",
            }}
            performance={{ min: 0.5 }}
            frameloop={isVisible ? "always" : "demand"}
          >
            <fog attach="fog" args={["#000000", 30, 45]} />
            <color attach="background" args={["#000000"]} />
            <ambientLight intensity={0.25} />
            <directionalLight
              castShadow={!isMobile}
              intensity={2}
              position={[10, 6, 6]}
              shadow-mapSize={isMobile ? [256, 256] : [512, 512]}
            >
              <orthographicCamera
                attach="shadow-camera"
                args={[-20, 20, 20, -20]}
              />
            </directionalLight>
            <Suspense fallback={null}>
              <Scene usePageScroll={usePageScroll} />
            </Suspense>
          </Canvas>
        </PageScrollContext.Provider>
      ) : (
        // Placeholder while loading
        <div className="w-full h-full bg-black" />
      )}
    </div>
  );
}
