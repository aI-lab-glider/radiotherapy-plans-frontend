import { Grid, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { useState } from "react";
import { RegionConfiguration } from "./ConfiguredRegion";
import {
  RegionName,
  RegionPropertiesGrid,
  RegionProperty,
  RegionTitle,
  StyledCard,
} from "./styled";
import { ConfigurationActions } from "./useRegionConfigurations";

interface RegionSettingCardProps {
  availableRegions: string[];
  config: RegionConfiguration;
  actions: ConfigurationActions;
}

export interface RegionSetting {
  type?: string;
  hotColdLevel?: number;
}
export function RegionSettingCard({
  availableRegions,
  config,
  actions,
}: RegionSettingCardProps) {
  const [cardState, setCardState] = useState<RegionSetting>({});

  return (
    <StyledCard variant="outlined">
      <CardContent>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={3}>
            <RegionTitle>Region:&nbsp;</RegionTitle>
          </Grid>
          <Grid item xs={3}>
            {config.activated ? (
              <RegionName>{config.type}</RegionName>
            ) : (
              <FormControl>
                <Select
                  value={config.type}
                  onChange={(e) =>
                    setCardState({
                      ...cardState,
                      type: e.target.value as string,
                    })
                  }
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {availableRegions.map((x) => (
                    <MenuItem value={x}>{x}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>

        <RegionPropertiesGrid container xs={12} spacing={2}>
          <Grid item xs={3}>
            <RegionProperty>Hot cold level</RegionProperty>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="standard-basic"
              label="Standard"
              variant="standard"
              onChange={(e) => {
                if (!/[0-9]/.test(e.target.value)) {
                  return;
                }
                setCardState({
                  ...cardState,
                  hotColdLevel: parseFloat(e.target.value),
                });
              }}
            />
          </Grid>
        </RegionPropertiesGrid>

        {/* <RegionProperty>Transparency</RegionProperty>
            <Slider
                value={config.transparency}
                onChange={(event, newValue) => actions.setTransparency(config.id, newValue as number)}
                aria-labelledby="continuous-slider" /> */}
      </CardContent>
      <CardActions>
        <Button
          color="secondary"
          size="small"
          onClick={() => actions.remove(config.id)}
        >
          Delete
        </Button>
        <Button
          color="secondary"
          size="small"
          onClick={() => actions.setType(config.id, cardState)}
        >
          Apply
        </Button>
        {/* {config.activated ? (
                <Button
                    color="primary"
                    size="small"
                    onClick={() => actions.deactivate(config.id)}
                >
                    Deactivate
                </Button>
            ) : (
                <Button
                    color="primary"
                    size="small"
                    onClick={() => actions.activate(config.id)}
                >
                    Activate
                </Button>
            )} */}
      </CardActions>
    </StyledCard>
  );
}
