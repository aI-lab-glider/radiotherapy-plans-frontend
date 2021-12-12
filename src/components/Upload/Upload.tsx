import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import JSZip from "jszip";
import { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { ProgressDiv, ContainerDiv, UploadButton } from "./Upload.style";
import { setUploadedFiels } from "../../actions/uploadActions";
import { ActionType, reducer, initialState } from "./reducer";
import UploadList from "./UploadList";
import UploadDropzone from "./UploadDropzone";

export default function Upload() {
  const [state, localDispatch] = useReducer(reducer, initialState);
  const [showProgress, setShowProgress] = useState(false);
  const globalDispatch = useDispatch();

  const zipAndUpload = () => {
    setShowProgress(true);
    const zip = new JSZip();
    Object.entries(state).forEach(([name, files]) => {
      const folder = zip.folder(name);
      files.forEach((file: File, index: number) =>
        folder!.file(`${index}.dcm`, file)
      );
    });

    zip.generateAsync({ type: "blob" }).then((file) => {
      const formData = new FormData();
      formData.append("file", file, "archive.zip");
      axios
        .post(process.env.REACT_APP_UPLOAD_URL!, formData)
        .then((response) => {
          localDispatch({ type: ActionType.RESET });
          setShowProgress(false);
          globalDispatch(setUploadedFiels(true));
          alert(response.data);
        })
        .catch((error) => {
          //TODO left for test purposes
          //remove:
          localDispatch({ type: ActionType.RESET });
          setShowProgress(false);
          globalDispatch(setUploadedFiels(true));
          //uncomment:
          // setShowProgress(false);
          // alert(error);
        });
    });
  };

  return (
    <ContainerDiv>
      <UploadList state={state} />
      <UploadDropzone localDispatch={localDispatch} />
      <ProgressDiv>{showProgress && <CircularProgress />}</ProgressDiv>
      <UploadButton
        disabled={Object.values(state).some((files) => files.length === 0)}
        variant="contained"
        onClick={zipAndUpload}
      >
        Zip And Upload
      </UploadButton>
    </ContainerDiv>
  );
}
