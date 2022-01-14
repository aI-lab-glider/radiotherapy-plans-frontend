import { RGBColor } from "react-color";

export interface RegionConfiguration {
  id: string;
  type: string;
  transparency: number;
  color: RGBColor;
  activated: boolean;
}
