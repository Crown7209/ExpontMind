import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { ThreeElements } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
    Object_4: THREE.Mesh;
    Object_5: THREE.Mesh;
    Object_6: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshPhysicalMaterial;
  };
};

export function Mountain(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/snowy_mountain_v2_-_terrain (1).glb"
  ) as unknown as GLTFResult;
  return (
    <group
      {...props}
      dispose={null}
      scale={32}
      rotation={[0.75, -1.5, 0]}
      position={[50, 0, -120]}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials["Material.001"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/snowy_mountain_v2_-_terrain (1).glb");
