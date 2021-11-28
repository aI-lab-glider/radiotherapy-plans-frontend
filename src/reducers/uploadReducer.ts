import { AnyAction } from "redux";

export interface UploadState {
  isFileUploaded: boolean;
  regionTypes: Array<string | undefined>;
}

export const initialState: UploadState = {
  isFileUploaded: false,
  regionTypes: [],
};

const uploadReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "regions":
      return {
        ...state,
        regionTypes: action.payload,
      };
    case "uploaded":
      return {
        ...state,
        isFileUploaded: action.payload,
      };
    default:
      return state;
  }
};

export default uploadReducer;
