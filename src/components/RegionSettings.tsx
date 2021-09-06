import React, { MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ContinuousSlider from "./Slider";

export default function RegionSettings() {
  const [regions, setRegions] = React.useState<
    Array<{
      id: string;
      type: string;
      transparency: number;
      activated: boolean;
    }>
  >([]);

  const addNewRegion = (e: MouseEvent<HTMLButtonElement>) => {
    setRegions([
      ...regions,
      { type: "None", transparency: 50, activated: false, id: uuidv4() },
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

  return (
    <div style={{ width: 320, padding: 20 }}>
      <Typography>
        <h2>Region Settings</h2>
      </Typography>
      <div>
        {regions &&
          regions.map((region) => {
            return (
              <Card style={{ margin: 10 }} variant="outlined">
                <CardContent>
                  <Grid container xs={12} spacing={2}>
                    <Grid>
                      <Typography component="h1" style={{ marginTop: 4 }}>
                        Region:&nbsp;
                      </Typography>
                    </Grid>
                    <Grid>
                      {region.activated ? (
                        <Typography component="h1" style={{ marginTop: 4 }}>
                          {region.type}
                        </Typography>
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
                            style={{ width: 100 }}
                          >
                            <MenuItem value="None">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="maxilla">maxilla</MenuItem>
                            <MenuItem value="jawbone">jawbone</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  </Grid>
                  <ContinuousSlider
                    title="Transparency"
                    leftIcon={<RadioButtonCheckedIcon />}
                    rightIcon={<RadioButtonUncheckedIcon />}
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
              </Card>
            );
          })}
      </div>
      <Button variant="contained" onClick={addNewRegion}>
        New Region
      </Button>
    </div>
  );
}
