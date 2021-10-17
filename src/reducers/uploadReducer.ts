import { AnyAction } from "redux";

export interface UploadState {
  isFilesUploaded: boolean;
}

export const initialState: UploadState = {
  isFilesUploaded: false,
};

const uploadReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "uploaded":
      return {
        ...state,
        isFilesUploaded: action.payload,
      };
    default:
      return state;
  }
};

export default uploadReducer;
