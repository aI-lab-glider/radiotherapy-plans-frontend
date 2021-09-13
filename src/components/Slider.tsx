import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import React, { SVGProps } from "react";

type SliderProps = {
  title: string;
  leftIcon: SVGProps<SVGElement>;
  rightIcon: SVGProps<SVGElement>;
};

export default function ContinuousSlider({
  title,
  leftIcon,
  rightIcon,
}: SliderProps) {
  const [value, setValue] = React.useState<number>(50);

  const handleChange = (event: unknown, newValue: number | number[]) => {
    setValue(newValue as number);
  };

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
            onChange={handleChange}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>{rightIcon}</Grid>
      </Grid>
    </div>
  );
}
