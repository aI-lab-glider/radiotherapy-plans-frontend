import { createAction } from "@reduxjs/toolkit";


export const setRegionTypes =
    createAction<Array<string | undefined>>("regions");
export interface UploadedFilePayload {
    isSuccess: boolean;
    meshFileUrl?: string;
}

export const setUploadedFiels = createAction<UploadedFilePayload>("uploaded");
