import axios from "axios";
import { useState } from "react";
import { RGBColor } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addSelectedRegion,
  removeSelectedRegion,
} from "../../actions/uploadActions";
import { AppState } from "../../store";
import { RegionConfiguration } from "./ConfiguredRegion";
import { RegionSetting } from "./RegionSettingCard";

export const defaultConfigurationFactory = (
  id: string
): RegionConfiguration => ({
  type: "None",
  transparency: 50,
  color: { r: 225, g: 68, b: 13, a: 1 },
  activated: false,
  id: id,
  hotColdValue: 5,
});

export interface ConfigurationActions {
  activate: (id: string) => void;
  deactivate: (id: string) => void;
  setType: (id: string, newType: RegionSetting) => void;
  setTransparency: (id: string, newValue: number) => void;
  setColor: (id: string, newValue: RGBColor) => void;
  remove: (id: string) => void;
  addConfiguration: () => void;
}

export function useRegionConfigurations(): [
  Record<string, RegionConfiguration>,
  ConfigurationActions
] {
  const [configurations, setConfigurations] = useState<
    Record<string, RegionConfiguration>
  >({});
  const meshName = useSelector<AppState>((state) => state.meshName);

  const dispatch = useDispatch();

  const addConfiguration = () => {
    const id = uuidv4();
    setConfigurations({
      ...configurations,
      [id]: defaultConfigurationFactory(id),
    });
  };

  const activate = (id: string) =>
    setConfigurations({
      ...configurations,
      [id]: {
        ...configurations[id],
        activated: true,
      },
    });

  const deactivate = (id: string) =>
    setConfigurations({
      ...configurations,
      [id]: {
        ...configurations[id],
        activated: false,
      },
    });

  const setType = (id: string, newType: RegionSetting) => {
    const oldType = configurations[id].type;
    if (oldType !== defaultConfigurationFactory(id).type) {
      dispatch(removeSelectedRegion(oldType));
    }
    setConfigurations({
      ...configurations,
      [id]: {
        ...configurations[id],
        ...newType,
      },
    });

    // TODO: move to middleware
    const calculateROIEndpoint = `${process.env.REACT_APP_API_URL}/CalculateRoi/${meshName}?roi_name=${newType.type}&hot_cold_level=${newType.hotColdLevel}`;
    axios.post(calculateROIEndpoint).then((response) => {
      if (response.status === 200 && newType.type) {
        dispatch(addSelectedRegion(newType.type));
      }
    });
  };

  const setTransparency = (id: string, newValue: number) =>
    setConfigurations({
      ...configurations,
      [id]: {
        ...configurations[id],
        transparency: newValue,
      },
    });

  const setColor = (id: string, newColor: RGBColor) =>
    setConfigurations({
      ...configurations,
      [id]: {
        ...configurations[id],
        color: newColor,
      },
    });

  const remove = (id: string) => {
    const confCopy = { ...configurations };
    delete confCopy[id];
    dispatch(removeSelectedRegion(configurations[id].type));
    setConfigurations(confCopy);
  };

  return [
    configurations,
    {
      activate,
      deactivate,
      setType,
      setTransparency,
      setColor,
      addConfiguration,
      remove,
    },
  ];
}
