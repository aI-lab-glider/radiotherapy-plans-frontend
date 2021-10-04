import { Suspense, useEffect, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import styled from "styled-components";
import * as THREE from "three";
import { Plane, Vector3 } from "three";

interface ModelProps {
  opacity: number;
  radius: number;
}

interface ClippingPlaneProps {
  startPoint: number;
  radius: number;
}

function ClippingPlane(props: ClippingPlaneProps) {
  const { gl } = useThree();
  let plane = new Plane(new Vector3(0, 0, -1), props.startPoint - props.radius);
  gl.clippingPlanes = [plane];
  gl.localClippingEnabled = true;
  return <></>;
}

function Model(props: ModelProps) {
  const obj = useLoader(OBJLoader, "skull.OBJ");
  var startPoint = 0;
  obj.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      const material = child.material;
      material.transparent = true;
      material.opacity = props.opacity;
      child.material = material;
      const xPoints = child.geometry.attributes.position.array.filter(
        (element: number, index: number) => index % 3 === 0
      );
      startPoint = findMax(xPoints);
    }
  });

  return (
    <>
      <primitive object={obj} scale={0.6} position={[0, -1.5, 0]} />
      <ClippingPlane startPoint={startPoint} radius={props.radius} />
    </>
  );

  function findMax(xPoints: Array<number>) {
    let max = xPoints[0];
    for (let i = 1; i < xPoints.length; ++i) {
      if (xPoints[i] > max) {
        max = xPoints[i];
      }
    }
    return max;
  }
}

interface ThreeCanvasProps {
  appBarHeight: number;
  colorIntensity: number;
  opacity: number;
  radius: number;
}

export default function ThreeCanvas({
  appBarHeight,
  colorIntensity,
  opacity,
  radius,
}: ThreeCanvasProps) {
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

  const StyledCanvas = styled(Canvas)`
    background-color: #333333;
    width: ${dimensions.width}px;
    height: ${dimensions.height - appBarHeight}px;
  `;

  return (
    <StyledCanvas
      style={{
        height: `${dimensions.height - appBarHeight}px`,
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={colorIntensity} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} />
        <OrbitControls />
        <Model opacity={opacity} radius={radius} />
      </Suspense>
    </StyledCanvas>
  );
}
