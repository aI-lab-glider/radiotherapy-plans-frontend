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
  const meshFileUrls = useSelector((state: AppState) => state.meshFileUrls);

  const [modelCenter] = useState<[number, number, number]>(ORIGIN);
  return (
    <>
      <StyledCanvas
        dimensions={dimensions}
        appBarHeight={appBarHeight}
        camera={{ position: [-1, -1, -1], far: 2000 }}
      >
        <axesHelper args={[1000]} />
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, -10, -10]} />
          <OrbitControls target={modelCenter} />
          {meshFileUrls.map((url) => (
            <>
              <color
                args={[
                  Math.floor(Math.random() * 255),
                  Math.floor(Math.random() * 255),
                  Math.floor(Math.random() * 255),
                ]}
              />
              <Model url={url} />
            </>
          ))}
        </Suspense>
      </StyledCanvas>
      );
    </>
  );
}
