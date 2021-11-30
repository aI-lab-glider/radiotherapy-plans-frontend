import styled from "styled-components";

export const PickerFrame = styled.div`
  padding: 5px;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
`;

interface ColorBoxProps {
  red: number;
  green: number;
  blue: number;
  opacity: number;
}

export const ColorBox = styled.div<ColorBoxProps>`
  width: 36px;
  height: 14px;
  border-radius: 2px;
  background: rgba(
    ${({ red }) => red},
    ${({ green }) => green},
    ${({ blue }) => blue},
    ${({ opacity }) => opacity}
  );
`;
// background: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a});
