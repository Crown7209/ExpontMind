import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { JSX } from "react";

type GLTFResult = GLTF & {
  nodes: {
    polySurface130_Structure_Material_PBS_0: THREE.Mesh;
    pCube1_lambert1_0: THREE.Mesh;
    polySurface126_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface127_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface128_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface129_StingrayPBS3_0: THREE.Mesh;
    polySurface131_Structure_Material_PBS_0: THREE.Mesh;
    polySurface141_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface142_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface143_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface144_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface145_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface146_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface147_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface152_Structure_Material_PBS_0: THREE.Mesh;
    polySurface153_Structure_Material_PBS_0: THREE.Mesh;
    polySurface154_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface155_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface156_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface212_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface159_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface200_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface161_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface162_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface163_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface201_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface165_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface166_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface167_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface168_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface202_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface170_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface171_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface172_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface173_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface203_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface175_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface176_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface177_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface178_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface204_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface180_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface181_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface182_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface183_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface196_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface197_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface205_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface206_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface207_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface208_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface209_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface210_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface211_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface185_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface186_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface187_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface188_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface198_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface190_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface191_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface192_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface193_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface199_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface195_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface219_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface220_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface221_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface222_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface223_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface224_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface225_Tubular_Material_PBS_0: THREE.Mesh;
    polySurface226_Tubular_Material_PBS_0: THREE.Mesh;
  };
  materials: {
    Structure_Material_PBS: THREE.MeshStandardMaterial;
    lambert1: THREE.MeshStandardMaterial;
    Tubular_Material_PBS: THREE.MeshStandardMaterial;
    StingrayPBS3: THREE.MeshStandardMaterial;
  };
};

export function Reactor(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/Reactor.glb") as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface212_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[-8.83, 0, 60.769]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface200_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[-8.83, 0, 55.005]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface201_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[32.651, 0, 45.138]}
        rotation={[0, Math.PI / 4, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface202_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[55.005, 0, 8.83]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface203_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[45.138, 0, -32.651]}
        rotation={[-Math.PI, Math.PI / 4, -Math.PI]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface204_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[8.83, 0, -55.005]}
        rotation={[-Math.PI, 0, -Math.PI]}
      />
      <group
        position={[-32.651, 0, -45.138]}
        rotation={[-Math.PI, -Math.PI / 4, -Math.PI]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface196_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface197_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface205_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface206_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface207_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface208_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface209_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface210_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface211_Tubular_Material_PBS_0.geometry}
          material={materials.Tubular_Material_PBS}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface198_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[-55.005, 0, -8.83]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface199_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
        position={[-45.138, 0, 32.651]}
        rotation={[0, -Math.PI / 4, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface130_Structure_Material_PBS_0.geometry}
        material={materials.Structure_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pCube1_lambert1_0.geometry}
        material={materials.lambert1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface126_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface127_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface128_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface129_StingrayPBS3_0.geometry}
        material={materials.StingrayPBS3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface131_Structure_Material_PBS_0.geometry}
        material={materials.Structure_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface141_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface142_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface143_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface144_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface145_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface146_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface147_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface152_Structure_Material_PBS_0.geometry}
        material={materials.Structure_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface153_Structure_Material_PBS_0.geometry}
        material={materials.Structure_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface154_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface155_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface156_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface159_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface161_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface162_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface163_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface165_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface166_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface167_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface168_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface170_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface171_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface172_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface173_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface175_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface176_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface177_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface178_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface180_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface181_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface182_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface183_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface185_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface186_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface187_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface188_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface190_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface191_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface192_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface193_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface195_Tubular_Material_PBS_0.geometry}
        material={materials.Tubular_Material_PBS}
      />
    </group>
  );
}

useGLTF.preload("/Reactor.glb");
