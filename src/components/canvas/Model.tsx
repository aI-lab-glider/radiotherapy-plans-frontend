import { useLoader } from "@react-three/fiber";
import { forwardRef } from "react";
import { Group } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

interface ModelProps {
  url: string;
}

export const Model = forwardRef<Group, ModelProps>(({ url }, ref) => {
  const geometry = useLoader(OBJLoader, url);
  return <primitive object={geometry} ref={ref} />;
});
