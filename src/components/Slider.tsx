import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { ReactElement, SVGProps } from "react";

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

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
  const classes = useStyles();
  const [value, setValue] = React.useState<number>(50);

  const handleChange = (event: any, newValue: number | number[]) => {
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
