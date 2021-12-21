import { AnyAction } from "redux";
import {
  setUploadedFiels as setUploadedFiles,
  UploadedFilePayload,
} from "../actions/uploadActions";

export interface UploadState {
  isFileUploaded: boolean;
  regionTypes: Array<string | undefined>;
  meshFileUrl?: string;
}

export const initialState: UploadState = {
  isFileUploaded: false,
  regionTypes: [],
};

interface Upload {
  type: "uploaded";
  payload: UploadedFilePayload;
}
interface Regions {
  type: "regions";
  payload: Array<string | undefined>;
}

const uploadReducer = (
  state = initialState,
  action: Regions | Upload
): UploadState => {
  switch (action.type) {
    case "regions":
      return {
        ...state,
        regionTypes: action.payload,
      };
    case "uploaded":
      return {
        ...state,
        meshFileUrl: action.payload.meshFileUrl,
        isFileUploaded: action.payload.isSuccess,
      };
    default:
      return state;
  }
};

export default uploadReducer;
