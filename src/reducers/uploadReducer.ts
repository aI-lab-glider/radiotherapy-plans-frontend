import { UploadedFilePayload } from "../actions/uploadActions";

export interface UploadState {
  isFileUploaded: boolean;
  regionTypes: string[];
  meshFileUrls: string[];
  meshName: string;
}

export const initialState: UploadState = {
  isFileUploaded: false,
  regionTypes: [],
  meshFileUrls: [],
  meshName: "",
};

interface Upload {
  type: "uploaded";
  payload: UploadedFilePayload;
}
interface Regions {
  type: "regions";
  payload: string[];
}

interface AddSelectedRegion {
  type: "addSelectedRegion";
  payload: string;
}

interface RemoveSelectedRegion {
  type: "removeSelectedRegion";
  payload: string;
}

const uploadReducer = (
  state = initialState,
  action: Regions | Upload | AddSelectedRegion | RemoveSelectedRegion
): UploadState => {
  let roiName, regionUrl;
  switch (action.type) {
    case "regions":
      return {
        ...state,
        regionTypes: action.payload,
      };
    case "uploaded":
      const url = `${process.env.REACT_APP_API_URL!}/Upload`;
      const mainMeshUrl = `${url}?meshName=${action.payload.meshName}`;
      return {
        ...state,
        meshFileUrls: [mainMeshUrl],
        isFileUploaded: action.payload.isSuccess,
        meshName: action.payload.meshName ?? "",
      };

    case "addSelectedRegion":
      roiName = action.payload;
      regionUrl = `${process.env.REACT_APP_API_URL}/CalculateRoi/${state.meshName}?roiName=${roiName}`;

      return {
        ...state,
        meshFileUrls: [regionUrl], // TODO: should be multiple regions, that react approperly
      };
    case "removeSelectedRegion":
      roiName = action.payload;
      regionUrl = `${process.env.REACT_APP_API_URL}/CalculateRoi/${state.meshName}?roiName=${roiName}`;

      return {
        ...state,
        meshFileUrls: state.meshFileUrls.filter(
          (url) => url !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default uploadReducer;
