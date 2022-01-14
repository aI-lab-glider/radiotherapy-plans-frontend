import { createAction } from "@reduxjs/toolkit";

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
