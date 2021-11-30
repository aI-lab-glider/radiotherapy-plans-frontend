import React, { useState } from "react";

import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { ColorBox, PickerFrame } from "./ColorPicker.style";

interface ColorPickerProps {
  regionId: string;
  color: RGBColor;
  onChange: (id: string, color: RGBColor) => void;
}

export default function ColorPicker(props: ColorPickerProps) {
  const [display, setDisplay] = useState(false);
  const [color, setColor] = useState(props.color);

  const handleClick = () => {
    display && props.onChange(props.regionId, color);
    setDisplay(!display);
  };

  return (
    <div>
      <PickerFrame onClick={handleClick}>
        <ColorBox
          red={color.r}
          green={color.g}
          blue={color.b}
          opacity={Number(color.a)}
        />
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
