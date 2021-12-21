import { Button, CircularProgress } from "@material-ui/core";
import axios from "axios";
import dicomParser from "dicom-parser";
import JSZip from "jszip";
import React, { useCallback, useReducer, useRef, useState } from "react";
import { FileRejection } from "react-dropzone";
import { DropzoneComponent } from "./DropzoneComponent";
import { RequiredFilesListComponents } from "./RequiredFilesListComponents";
import { CenteredDiv, Progress, SectionCaption } from "./styles";

export interface RequiredFiles {
  ctFiles: File[];
  rtStructFile: File[];
  rtDoseFile: File[];
}

const initialState: RequiredFiles = {
  ctFiles: [],
  rtStructFile: [],
  rtDoseFile: [],
};

enum ActionType {
  CT = "CT",
  DOSE = "RTDOSE",
  STRUCT = "RTSTRUCT",
  RESET = "RESET",
}

interface Action {
  type: ActionType | string;
  payload?: File;
}

function reducer(state: RequiredFiles, action: Action): RequiredFiles {
  switch (action.type) {
    case ActionType.CT:
      return { ...state, ctFiles: [...state.ctFiles, action.payload!] };
    case ActionType.DOSE:
      return { ...state, rtDoseFile: [action.payload!] };
    case ActionType.STRUCT:
      return { ...state, rtStructFile: [action.payload!] };
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
}

interface UploadProps {
  onUpload: (fileName: string) => void;
}
export default function Upload({ onUpload }: UploadProps) {
  const [requiredFiles, requiredFilesDispatch] = useReducer(
    reducer,
    initialState
  );
  const [showProgress, setShowProgress] = useState(false);
  const studyUid = useRef("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.every((file) => parse(file));
      if (rejectedFiles.length > 0)
        alert(
          "Invalid files were omitted: " +
            rejectedFiles.map((fileWrapper) => `\n${fileWrapper.file.name}`)
        );
    },
    []
  );

  const parse = (file: File): boolean => {
    file.arrayBuffer().then((arrayBuffer) => {
      const byteArray = new Uint8Array(arrayBuffer);
      try {
        const dataSet = dicomParser.parseDicom(byteArray);
        const studyInstanceUid = dataSet.string("x0020000d");
        if (studyUid.current !== studyInstanceUid) {
          if (studyUid.current === "") studyUid.current = studyInstanceUid;
          else {
            alert("Files studyInstanceUid doesn't match. Files will be reset!");
            requiredFilesDispatch({ type: ActionType.RESET });
            studyUid.current = "";
            return false;
          }
        }
        const modality = dataSet.string("x00080060");
        requiredFilesDispatch({ type: modality, payload: file });
      } catch (ex) {
        console.log("Error parsing byte stream", ex);
      }
    });
    return true;
  };

  const zipAndUpload = () => {
    setShowProgress(true);
    const zip = new JSZip();
    Object.entries(requiredFiles).forEach(([name, files]) => {
      const folder = zip.folder(name);
      files.forEach((file: File, index: number) =>
        folder!.file(`${index}.dcm`, file)
      );
    });

    zip.generateAsync({ type: "blob" }).then((file) => {
      const formData = new FormData();
      const fileName = "archive";
      formData.append("file", file, `${fileName}.zip`);
      axios
        .post(`${process.env.REACT_APP_API_URL!}/Upload`, formData)
        .then(() => {
          requiredFilesDispatch({ type: ActionType.RESET });
          onUpload(fileName);
        })
        .finally(() => setShowProgress(false));
    });
  };

  return (
    <>
      <RequiredFilesListComponents requiredFiles={requiredFiles} />
      <DropzoneComponent onDrop={onDrop} />
      <Progress>{showProgress && <CircularProgress />}</Progress>
      <Button
        disabled={Object.values(requiredFiles).some(
          (files) => files.length === 0
        )}
        variant="contained"
        onClick={zipAndUpload}
        style={{ marginLeft: 20, marginRight: 20 }}
      >
        Zip And Upload
      </Button>
    </>
  );
}
