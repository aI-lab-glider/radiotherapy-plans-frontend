import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const Model = () => {
  const obj = useLoader(OBJLoader, "skull.OBJ");
  return <primitive object={obj} scale={0.6} position={[0, -1.5, 0]} />;
};

interface ThreeCanvasProps {
  appBarHeight: number;
}

export default function ThreeCanvas({ appBarHeight }: ThreeCanvasProps) {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <Canvas
      style={{
        backgroundColor: "#333333",
        width: `${dimensions.width}px`,
        height: `${dimensions.height - appBarHeight}px`,
      }}
    >
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
