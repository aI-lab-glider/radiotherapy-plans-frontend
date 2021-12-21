import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { MeshWizardMode } from "./MeshWizard";

export interface ModelSelectorProps {
  onChange: (newMode: MeshWizardMode) => void;
}

export function ModeSelector({ onChange }: ModelSelectorProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">Select wizard mode</InputLabel>
      <Select
        labelId="select-label"
        onChange={(event) => onChange(event.target.value as MeshWizardMode)}
        defaultValue={MeshWizardMode.Selection}
      >
        {Object.entries(MeshWizardMode).map(([key, value]) => (
          <MenuItem value={value}>{key}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
