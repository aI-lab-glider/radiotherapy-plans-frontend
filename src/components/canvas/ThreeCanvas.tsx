import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Group, Mesh } from "three";
import { AppState } from "../../store";
import { Loader } from "./Loader";
import { Model } from "./Model";
import { StyledCanvas } from "./styles";
import { useResize } from "./useResize";

interface ThreeCanvasProps {
  appBarHeight: number;
}

const ORIGIN: [number, number, number] = [0, 0, 0];

function getMeshCenter(group: Group | null): [number, number, number] {
  if (!group) {
    return ORIGIN as [number, number, number];
  }
  const mainMesh = group.children[0] as Mesh;
  const boundingSphere = mainMesh.geometry.boundingSphere;
  return (boundingSphere?.center.toArray() ?? ORIGIN) as [
    number,
    number,
    number
  ];
}

export function ThreeCanvas({ appBarHeight }: ThreeCanvasProps) {
  const dimensions = useResize();
  const meshFileUrl = useSelector((state: AppState) => state.meshFileUrl);

  const [modelCenter] = useState<[number, number, number]>(ORIGIN);
  return (
    <>
      <StyledCanvas
        dimensions={{ width: 100, height: 100 }}
        appBarHeight={20}
        style={{
          height: `${dimensions.height - appBarHeight}px`,
        }}
        camera={{ position: [-1, -1, -1], far: 2000 }}
      >
        <axesHelper args={[1000]} />
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, -10, -10]} />
          <OrbitControls target={modelCenter} />
          {meshFileUrl && <Model url={meshFileUrl} />}
        </Suspense>
      </StyledCanvas>
      );
    </>
  );
}
