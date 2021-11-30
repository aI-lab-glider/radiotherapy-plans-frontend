import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";

export const RegionSettingsDiv = styled.div`
  width: 320px;
  padding: 20px;
`;

export const RegionSettingCard = styled(Card)`
  margin-bottom: 10px;
`;

export const RegionTitle = styled.h1`
  margin-top: 4px;
  font-size: 1em;
  font-weight: bold;
`;

export const RegionName = styled.h1`
  margin-top: 4px;
  font-size: 1em;
`;

export const RegionProperty = styled.h1`
  font-size: 1em;
  font-weight: bold;
`;

export const RegionPropertiesGrid = styled(Grid)`
  margin-top: 10px;
`;
