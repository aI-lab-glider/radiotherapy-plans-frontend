import React, { useState } from "react";

import { ColorResult, RGBColor, SketchPicker } from "react-color";
import styled from "styled-components";

interface ColorPickerProps {
  regionId: string;
  rgbColor: RGBColor;
  onChange: (id: string, color: RGBColor) => void;
}

export default function ColorPicker({
  regionId,
  rgbColor,
  onChange,
}: ColorPickerProps) {
  const [display, setDisplay] = useState(false);
  const [color, setColor] = useState(rgbColor);

  const PickerFrame = styled.div`
    padding: 5px;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
  `;

  const ColorBox = styled.div`
    width: 36px;
    height: 14px;
    border-radius: 2px;
    background: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a});
  `;

  const handleClick = () => {
    display && onChange(regionId, color);
    setDisplay(!display);
  };

  return (
    <div>
      <PickerFrame onClick={handleClick}>
        <ColorBox />
      </PickerFrame>

      {display ? (
        <div>
          <SketchPicker
            color={{
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a,
            }}
            onChange={(
              color: ColorResult,
              event: React.ChangeEvent<HTMLInputElement>
            ) => setColor(color.rgb)}
          />
        </div>
      ) : null}
    </div>
  );
}
