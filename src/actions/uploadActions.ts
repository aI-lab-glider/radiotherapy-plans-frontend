import { createAction } from "@reduxjs/toolkit";

export const setUploadedFiels = createAction<boolean>("uploaded");
export const setRegionTypes = createAction<Array<string>>("regions");
