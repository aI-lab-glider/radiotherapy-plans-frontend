import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";

export interface DicomSelectorProps {
  onChange: (newSelection?: string) => void;
}

export function DicomSelector({ onChange }: DicomSelectorProps) {
  const [meshesNames, setMeshesNames] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL!}/UploadedDicoms`)
      .then((meshesNames) => {
        setMeshesNames(JSON.parse(meshesNames.data).meshesNames);
      });
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">Select an uploaded DICOM</InputLabel>
      <Select
        labelId="select-label"
        onChange={(event) => onChange(event.target.value as string)}
      >
        {meshesNames.map((meshName) => (
          <MenuItem value={meshName}>{meshName}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
