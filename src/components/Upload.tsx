import { Button, CircularProgress, Typography } from "@material-ui/core";
import axios from "axios";
import dicomParser from "dicom-parser";
import JSZip from "jszip";
import React, { useCallback, useReducer, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import styled from "styled-components";

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

export default function Upload() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showProgress, setShowProgress] = useState(false);
  const studyUid = useRef("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.every((file) => {
        return parse(file);
      });
      if (rejectedFiles.length > 0)
        alert(
          "Invalid files were omitted: " +
            rejectedFiles.map((fileWrapper) => `\n${fileWrapper.file.name}`)
        );
    },
    []
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".dcm",
  });

  const parse = (file: File): boolean => {
    file.arrayBuffer().then((arrayBuffer) => {
      const byteArray = new Uint8Array(arrayBuffer);

      try {
        const dataSet = dicomParser.parseDicom(byteArray /*, options */);
        const studyInstanceUid = dataSet.string("x0020000d");
        if (studyUid.current !== studyInstanceUid) {
          if (studyUid.current === "") studyUid.current = studyInstanceUid;
          else {
            alert("Files studyInstanceUid doesn't match. Files will be reset!");
            dispatch({ type: ActionType.RESET });
            studyUid.current = "";
            return false;
          }
        }
        const modality = dataSet.string("x00080060");
        dispatch({ type: modality, payload: file });
      } catch (ex) {
        console.log("Error parsing byte stream", ex);
      }
    });
    return true;
  };

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
          dispatch({ type: ActionType.RESET });
          setShowProgress(false);
          alert(response.data);
        })
        .catch((error) => {
          setShowProgress(false);
          alert(error);
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
    <>
      {Object.values(state).some((value) => value.length === 0) && (
        <h2>Add:</h2>
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
        }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <Typography display="block">
        {Object.values(state).map((files) =>
          files.map((file: File) => `*${file.name}*`)
        )}
      </Typography>
      <ProgressDiv>{showProgress && <CircularProgress />}</ProgressDiv>
      <Button
        disabled={Object.values(state).some((files) => files.length === 0)}
        variant="contained"
        onClick={zipAndUpload}
      >
        Zip And Upload
      </Button>
    </>
  );
}
