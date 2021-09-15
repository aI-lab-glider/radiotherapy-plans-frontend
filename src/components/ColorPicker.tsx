import React, { useState } from "react";

import reactCSS from "reactcss";

import { ColorResult, RGBColor, SketchPicker } from "react-color";

interface ColorPickerProps {
  regionId: string;
  color: RGBColor;
  onChange: (id: string, color: RGBColor) => void;
}

export default function ColorPicker(props: ColorPickerProps) {
  const [display, setDisplay] = useState(false);

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",

        height: "14px",

        borderRadius: "2px",

        background: `rgba(${props.color.r}, ${props.color.g}, ${props.color.b}, ${props.color.a})`,
      },

      swatch: {
        padding: "5px",

        background: "#fff",

        borderRadius: "1px",

        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",

        display: "inline-block",

        cursor: "pointer",
      },
    },
  });

  const handleClick = () => {
    setDisplay(!display);
  };

  const handleClose = () => {
    setDisplay(false);
  };

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>

      {display ? (
        <div>
          <div onClick={handleClose} />

          <SketchPicker
            color={{
              r: props.color.r,
              g: props.color.g,
              b: props.color.b,
              a: props.color.a,
            }}
            onChange={(
              color: ColorResult,
              event: React.ChangeEvent<HTMLInputElement>
            ) => props.onChange(props.regionId, color.rgb)}
          />
        </div>
      ) : null}
    </div>
  );
}
