import { useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Group, Material, Mesh, MeshStandardMaterial } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

type GroupUpdateCallback = (newMesh: Group | null) => void;
interface ModelProps {
  url: string;
  onMeshChange?: GroupUpdateCallback;
}

export const Model = forwardRef<Group, ModelProps>(
  ({ url, onMeshChange }, ref) => {
    let color = "#ffffff";
    if (url.includes("cold")) {
      color = "#ff0000";
    } else if (url.includes("hot")) {
      color = "#0000ff";
    } else if (url.includes("roi_name")) {
      color = "#00ff00";
    }
    const mat = new MeshStandardMaterial({
      color,
      opacity: 0.5,
      transparent: true,
    });

    return (
      <mesh position={[0, 0, 0]}>
        {ObjToPrimitive({ url, mat, onLoaded: onMeshChange })}
      </mesh>
    );
  }
);

interface ObjToPrimitiveProps {
  url: string;
  mat: Material;
  onLoaded?: GroupUpdateCallback;
}

function ObjToPrimitive({ url, mat, onLoaded }: ObjToPrimitiveProps) {
  const [obj, setObj] = useState<Group>();
  useMemo(
    () =>
      new OBJLoader().load(url, (group) => {
        onLoaded?.(group);
        setObj(group);
      }),
    [url]
  );
  if (obj) {
    obj.traverse((child: any) => {
      if (child instanceof Mesh) {
        child.material = mat;
      }
    });
    return <primitive object={obj} />;
  }
  return null;
}
