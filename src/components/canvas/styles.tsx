import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { WindowDimensions } from "./useResize";
import { Props } from "@react-three/fiber/dist/declarations/src/web/Canvas";

interface SCanvasProps extends Props {
  dimensions: WindowDimensions;
  appBarHeight: number;
}

export const StyledCanvas = styled(Canvas)<SCanvasProps>`
  background-color: #333333;
  height: ${({ dimensions, appBarHeight }) => dimensions.height}px!important;
`;
