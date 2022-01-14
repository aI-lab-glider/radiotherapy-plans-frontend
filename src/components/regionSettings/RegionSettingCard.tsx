import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import { RegionConfiguration } from "./ConfiguredRegion";
import { RegionName, RegionTitle, StyledCard } from "./styled";
import { ConfigurationActions } from "./useRegionConfigurations";

interface RegionSettingCardProps {
  availableRegions: string[];
  config: RegionConfiguration;
  actions: ConfigurationActions;
}

export function RegionSettingCard({
  availableRegions,
  config,
  actions,
}: RegionSettingCardProps) {
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
                    actions.setType(config.id, e.target.value as string)
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

        {/* <RegionPropertiesGrid container xs={12} spacing={2}>
                <Grid item xs={3}>
                    <RegionProperty>Color</RegionProperty>
                </Grid>
                <Grid item xs={3}>
                    <ColorPicker
                        color={config.color}
                        onChange={(color) => actions.setColor(config.id, color)} />
                </Grid>
            </RegionPropertiesGrid>
             */}
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
