import { Button, CircularProgress, Typography } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import axios from "axios";
import dicomParser from "dicom-parser";
import JSZip from "jszip";
import React, { useCallback, useReducer, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setUploadedFiels, setRegionTypes } from "../actions/uploadActions";

interface State {
  ctFiles: File[];
  rtStructFile: File[];
  rtDoseFile: File[];
}

const initialState: State = { ctFiles: [], rtStructFile: [], rtDoseFile: [] };

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

function reducer(state: State, action: Action): State {
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

const resetStudyUid = (
  studyUid: React.MutableRefObject<String>,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({ type: ActionType.RESET });
  studyUid.current = "";
};

const STUDY_INSTACE_UID_CODE = "x0020000d";
const MODALITY_CODE = "x00080060";
const REGION_TYPES_LIST_CODE = "x30060020";
const REGION_TYPE_CODE = "x30060026";

export default function Upload() {
  const [state, localDispatch] = useReducer(reducer, initialState);
  const [showProgress, setShowProgress] = useState(false);
  const studyUid = useRef("");
  const globalDispatch = useDispatch();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const parse = (file: File): boolean => {
        file.arrayBuffer().then((arrayBuffer) => {
          const byteArray = new Uint8Array(arrayBuffer);
          try {
            const dataSet = dicomParser.parseDicom(byteArray /*, options */);
            const studyInstanceUid = dataSet.string(STUDY_INSTACE_UID_CODE);
            if (
              studyUid.current !== studyInstanceUid &&
              studyUid.current === ""
            ) {
              studyUid.current = studyInstanceUid;
            } else {
              alert(
                "Files studyInstanceUid doesn't match. Files will be reset!"
              );
              resetStudyUid(studyUid, localDispatch);
              return false;
            }

            const modality = dataSet.string(MODALITY_CODE);

            if (modality === "RTSTRUCT") {
              let array = Array<string | undefined>();
              dataSet.elements[REGION_TYPES_LIST_CODE].items?.forEach(
                (item) => {
                  array.push(item.dataSet?.string(REGION_TYPE_CODE));
                }
              );
              globalDispatch(setRegionTypes(array));
            }

            localDispatch({ type: modality, payload: file });
          } catch (ex) {
            console.log("Error parsing byte stream", ex);
          }
        });
        return true;
      };

      acceptedFiles.every((file) => {
        return parse(file);
      });
      if (rejectedFiles.length > 0)
        alert(
          "Invalid files were omitted: " +
            rejectedFiles.map((fileWrapper) => `\n${fileWrapper.file.name}`)
        );
    },
    [globalDispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".dcm",
  });

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
        .post("http://127.0.0.1:5000/upload", formData)
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

  const StyledList = styled.ul`
    list-style-position: inside;
  `;

  const ProgressDiv = styled.div`
    margin: 10px;
    display: flex;
    justify-content: center;
  `;

  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      <Typography>
        <h2>Upload files</h2>
      </Typography>
      {Object.values(state).some((value) => value.length === 0) && (
        <Typography>Add following files:</Typography>
      )}
      <StyledList>
        {Object.entries(state)
          .filter(([key, value]) => value.length === 0)
          .map(([key, value]) => (
            <li> {key} </li>
          ))}
      </StyledList>
      <div
        {...getRootProps()}
        style={{
          margin: 10,
          padding: 40,
          backgroundColor: "#f1f1f1",
          borderStyle: "dashed",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon style={{ fontSize: 70 }} />
        <p>Choose a file or drag it here.</p>
      </div>
      <Typography display="block">
        {Object.values(state).map((files) =>
          files.map((file: File) => (
            <li style={{ listStyle: "none" }}>
              <CheckCircleOutlineIcon
                style={{ fontSize: 15, color: "green" }}
              />
              {file.name}
            </li>
          ))
        )}
      </Typography>
      <ProgressDiv>{showProgress && <CircularProgress />}</ProgressDiv>
      <Button
        disabled={Object.values(state).some((files) => files.length === 0)}
        variant="contained"
        onClick={zipAndUpload}
        style={{ marginLeft: 20, marginRight: 20 }}
      >
        Zip And Upload
      </Button>
    </div>
  );
}
