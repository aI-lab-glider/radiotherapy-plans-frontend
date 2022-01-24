import {
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { Suspense, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Group, Mesh, PointLightHelper } from "three";
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
  mainMesh.geometry.computeBoundingSphere();

  const { boundingSphere } = mainMesh.geometry;
  return (boundingSphere?.center.toArray().map(Math.floor) ?? ORIGIN) as [
    number,
    number,
    number
  ];
}

function getLightsLocations(group: Group | null): [number, number, number][] {
  if (!group) {
    return [ORIGIN as [number, number, number]];
  }
  const mainMesh = group.children[0] as Mesh;
  mainMesh.geometry.computeBoundingBox();

  const { boundingBox } = mainMesh.geometry;

  console.log(boundingBox?.min.toArray(), boundingBox?.max.toArray());
  return [boundingBox?.min.toArray(), boundingBox?.max.toArray()] as [
    number,
    number,
    number
  ][];
}

export function ThreeCanvas({ appBarHeight }: ThreeCanvasProps) {
  const dimensions = useResize();
  const meshFileUrls = useSelector((state: AppState) => state.meshFileUrls);
  return (
    <>
      <StyledCanvas
        dimensions={dimensions}
        appBarHeight={appBarHeight}
        camera={{ position: [-1, -1, -1], far: 2000 }}
      >
        <CanvasContent meshFileUrls={meshFileUrls} />
      </StyledCanvas>
      );
    </>
  );
}

function CanvasContent({ meshFileUrls }: { meshFileUrls: string[] }) {
  const [modelCenter, setModelCenter] =
    useState<[number, number, number]>(ORIGIN);
  const [lightsLocations, setLightsLocations] = useState([ORIGIN]);

  const onMeshChange = useCallback(
    (newMesh) => {
      const meshCenter = getMeshCenter(newMesh);
      setModelCenter(meshCenter);
      const lightLocations = getLightsLocations(newMesh);
      setLightsLocations(lightLocations);
    },
    [setModelCenter, setLightsLocations]
  );

  return (
    <>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.1} />

        {lightsLocations.map((location) => (
          <pointLight key={location.toString()} position={location} />
        ))}

        <OrbitControls target={modelCenter} makeDefault />

        {meshFileUrls.map((url) => (
          <Model key={url} url={url} onMeshChange={onMeshChange} />
        ))}

        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          onUpdate={() => {}} // TODO onUpdate after update mentioned in https://github.com/pmndrs/drei/issues/527 will be released
        >
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="black"
          />
        </GizmoHelper>
      </Suspense>
    </>
  );
}
