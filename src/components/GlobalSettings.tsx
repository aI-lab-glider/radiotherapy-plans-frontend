import React, { FormEventHandler } from "react";
import Typography from "@material-ui/core/Typography";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ContinuousSlider from "./Slider";
import styled from "styled-components";

interface GlobalSettingsProps {
  brightness: number;
  onBrightnessChange: ((
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void) &
    FormEventHandler<HTMLSpanElement>;
  cut: number;
  onCutChange: ((
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void) &
    FormEventHandler<HTMLSpanElement>;
}

export default function GlobalSettings({
  brightness,
  onBrightnessChange,
  cut,
  onCutChange,
}: GlobalSettingsProps) {
  const GlobalSettingsDiv = styled.div`
    width: 320px;
    padding: 20px;
  `;

  return (
    <GlobalSettingsDiv>
      <Typography>
        <h2>Global Settings</h2>
      </Typography>
      <ContinuousSlider
        title="Brightness"
        leftIcon={<BrightnessLowIcon />}
        rightIcon={<BrightnessHighIcon />}
        value={brightness}
        onChange={onBrightnessChange}
      />
      <ContinuousSlider
        title="Cut"
        leftIcon={<RemoveIcon />}
        rightIcon={<AddIcon />}
        value={cut}
        onChange={onCutChange}
      />
    </GlobalSettingsDiv>
  );
}
