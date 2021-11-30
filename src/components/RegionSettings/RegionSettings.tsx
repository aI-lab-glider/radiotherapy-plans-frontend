import React, { MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Slider } from "@material-ui/core";
import ColorPicker from "../ColorPicker/ColorPicker";
import { RGBColor } from "react-color";
import {
  RegionSettingsDiv,
  RegionSettingCard,
  RegionTitle,
  RegionName,
  RegionProperty,
  RegionPropertiesGrid,
} from "./RegionSettings.style";

interface Region {
  id: string;
  type: string;
  transparency: number;
  color: RGBColor;
  activated: boolean;
}

interface RegionSettingsProps {
  regions: Array<Region>;
  selectableRegions: Array<string | undefined>;
}

export default function RegionSettings(props: RegionSettingsProps) {
  const [regions, setRegions] = React.useState<Array<Region>>(props.regions);
  const addNewRegion = (e: MouseEvent<HTMLButtonElement>) => {
    setRegions([
      ...regions,
      {
        type: "None",
        transparency: 50,
        color: { r: 225, g: 68, b: 13, a: 1 },
        activated: false,
        id: uuidv4(),
      },
    ]);
  };

  const activateNewRegion = (id: string) => {
    const regionToActivate = regions.filter(
      (r) => r.id === id && r.type !== "None"
    );
    if (regionToActivate.length > 0) {
      const newRegions = regions.map((r) =>
        r.id === id ? { ...r, activated: true } : r
      );
      setRegions(newRegions);
    }
  };

  const inactivateNewRegion = (id: string) => {
    const newRegions = regions.map((r) =>
      r.id === id ? { ...r, activated: false } : r
    );
    setRegions(newRegions);
  };

  const deleteRegion = (id: string) => {
    const newRegions = regions.filter((r, i, rs) => r.id !== id);
    setRegions(newRegions);
  };

  const setRegionType = (id: string, newType: string) => {
    const newRegions = regions.map((r) =>
      r.id === id ? { ...r, type: newType } : r
    );
    setRegions(newRegions);
  };

  const handleTransparencyChange = (id: string, newValue: any) => {
    const newRegions = regions.map((r) =>
      r.id === id ? { ...r, transparency: newValue } : r
    );
    setRegions(newRegions);
  };

  function handleColorChange(id: string, newColor: RGBColor) {
    const newRegions = regions.map((r) =>
      r.id === id ? { ...r, color: newColor } : r
    );
    setRegions(newRegions);
  }

  return (
    <RegionSettingsDiv>
      <Typography>
        <h2>Region Settings</h2>
      </Typography>
      <div>
        {regions &&
          regions.map((region) => {
            return (
              <RegionSettingCard variant="outlined">
                <CardContent>
                  <Grid container xs={12} spacing={2}>
                    <Grid item xs={3}>
                      <RegionTitle>Region:&nbsp;</RegionTitle>
                    </Grid>
                    <Grid item xs={3}>
                      {region.activated ? (
                        <RegionName>{region.type}</RegionName>
                      ) : (
                        <FormControl>
                          <Select
                            value={region.type}
                            onChange={(e) => {
                              setRegionType(
                                region.id,
                                e.target.value as string
                              );
                            }}
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="None">
                              <em>None</em>
                            </MenuItem>
                            {props.selectableRegions.map((x) => (
                              <MenuItem value={x}>{x}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  </Grid>
                  <RegionPropertiesGrid container xs={12} spacing={2}>
                    <Grid item xs={3}>
                      <RegionProperty>Color</RegionProperty>
                    </Grid>
                    <Grid item xs={3}>
                      <ColorPicker
                        regionId={region.id}
                        color={region.color}
                        onChange={handleColorChange}
                      />
                    </Grid>
                  </RegionPropertiesGrid>
                  <RegionProperty>Transparency</RegionProperty>
                  <Slider
                    value={region.transparency}
                    onChange={(event, newValue) =>
                      handleTransparencyChange(region.id, newValue)
                    }
                    aria-labelledby="continuous-slider"
                  />
                </CardContent>
                <CardActions>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => deleteRegion(region.id)}
                  >
                    Delete
                  </Button>
                  {region.activated ? (
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => inactivateNewRegion(region.id)}
                    >
                      Inactivate
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => activateNewRegion(region.id)}
                    >
                      Activate
                    </Button>
                  )}
                </CardActions>
              </RegionSettingCard>
            );
          })}
      </div>
      <Button variant="contained" onClick={addNewRegion}>
        New Region
      </Button>
    </RegionSettingsDiv>
  );
}
