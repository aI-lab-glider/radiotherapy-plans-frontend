import { AnyAction } from "redux";

export interface UploadState {
  isFileUploaded: boolean;
}

export const initialState: UploadState = {
  isFileUploaded: false,
};

const uploadReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
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
