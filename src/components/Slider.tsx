import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import React, { SVGProps } from "react";

type SliderProps = {
  title: string;
  leftIcon: SVGProps<SVGElement>;
  rightIcon: SVGProps<SVGElement>;
  value: number;
  onValueChange: (event: unknown, newValue: number | number[]) => void;
};

export default function ContinuousSlider({
  title,
  leftIcon,
  rightIcon,
  value,
  onValueChange,
}: SliderProps) {
  return (
    <div>
      <Typography id="continuous-slider" gutterBottom>
        <h4>{title}</h4>
      </Typography>
      <Grid container xs={12} spacing={2}>
        <Grid item>{leftIcon}</Grid>
        <Grid item xs>
          <Slider
            value={value}
            onChange={onValueChange}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>{rightIcon}</Grid>
      </Grid>
    </div>
  );
}
