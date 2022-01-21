import { createAction } from "@reduxjs/toolkit";
import { RegionSetting } from "../components/regionSettings/RegionSettingCard";

export const setRegionTypes = createAction<string[]>("regions");
export interface UploadedFilePayload {
  isSuccess: boolean;
  meshName?: string;
}

export const setUploadedFiels = createAction<UploadedFilePayload>("uploaded");

export const addSelectedRegion = createAction<string>("addSelectedRegion");
export const removeSelectedRegion = createAction<string>(
  "removeSelectedRegion"
);
