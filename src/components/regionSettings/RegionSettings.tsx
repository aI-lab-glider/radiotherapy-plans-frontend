import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { RegionSettingCard } from "./RegionSettingCard";
import { RegionSettingsDiv } from "./styled";
import { useRegionConfigurations } from "./useRegionConfigurations";

interface RegionSettingsProps {
  regions: string[];
}

export default function RegionSettings({ regions }: RegionSettingsProps) {
  const [configurations, actions] = useRegionConfigurations();

  return (
    <RegionSettingsDiv>
      <Typography variant="h6">Region Settings</Typography>
      <div>
        {Object.values(configurations).map((configuration) => (
          <RegionSettingCard
            key={configuration.id}
            config={configuration}
            actions={actions}
            availableRegions={regions}
          />
        ))}
      </div>
      <Button variant="contained" onClick={actions.addConfiguration}>
        New Region
      </Button>
    </RegionSettingsDiv>
  );
}
