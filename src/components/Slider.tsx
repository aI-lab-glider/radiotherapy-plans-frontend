import Grid from "@material-ui/core/Grid";
import Slider, { SliderProps } from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import React, { SVGProps } from "react";

export interface ContinuousSliderProps extends SliderProps {
  title: string;
  leftIcon: SVGProps<SVGElement>;
  rightIcon: SVGProps<SVGElement>;
}

export default function ContinuousSlider({
  title,
  leftIcon,
  rightIcon,
  value,
  onChange,
}: ContinuousSliderProps) {
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
            onChange={onChange}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>{rightIcon}</Grid>
      </Grid>
    </div>
  );
}
