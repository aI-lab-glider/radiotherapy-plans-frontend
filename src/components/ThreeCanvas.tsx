import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const Model = () => {
  const obj = useLoader(OBJLoader, "skull.OBJ");
  return <primitive object={obj} scale={0.6} position={[0, -1.5, 0]} />;
};

export default function ThreeCanvas() {
  return (
    <Canvas style={{ backgroundColor: "#333333", height: window.innerHeight }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} />
        <OrbitControls />
        <Model />
      </Suspense>
    </Canvas>
  );
}
