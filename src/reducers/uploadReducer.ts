import { AnyAction } from "redux";

export interface UploadState {
  filesUploaded: boolean;
}

export const initialState: UploadState = {
  filesUploaded: false,
};

const uploadReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "uploaded":
      return {
        ...state,
        filesUploaded: action.filesUploaded,
      };
    default:
      return state;
  }
};

export default uploadReducer;
