import styled from "styled-components";
import { Canvas } from "@react-three/fiber";

interface CanvasProps {
  dimensions: {
    width: number;
    height: number;
  };
  appBarHeight: number;
}

const StyledCanvas = styled(Canvas)<CanvasProps>`
  background-color: #333333;
  width: ${({ dimensions }) => dimensions.width}px;
  height: ${({ dimensions, appBarHeight }) =>
    dimensions.height - appBarHeight}px;
`;

export default StyledCanvas;
