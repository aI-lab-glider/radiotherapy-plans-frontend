import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import JSZip from "jszip";
import axios from "axios";
import dicomParser from "dicom-parser";
import BasicSettings from "./BasicSettings";
import RegionSettings from "./RegionSettings";
import Divider from "@material-ui/core/Divider";

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [ct, setCt] = useState(false);
  const [rtstruct, setRtstruct] = useState(false);
  const [rtdose, setRtDose] = useState(false);
  let studyUid = "";

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setFiles((curr) => [...curr, ...acceptedFiles]);
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
        if (studyUid !== studyInstanceUid) {
          if (studyUid === "") studyUid = studyInstanceUid;
          else {
            alert("Files studyInstanceUid doesn't match. Files will be reset!");
            setFiles([]);
            setCt(false);
            setRtDose(false);
            setRtstruct(false);
            studyUid = "";
            return false;
          }
        }
        const modality = dataSet.string("x00080060");
        switch (modality) {
          case "CT":
            setCt(true);
            break;
          case "RTSTRUCT":
            setRtstruct(true);
            break;
          case "RTDOSE":
            setRtDose(true);
            break;
          default:
            console.log(modality);
        }
      } catch (ex) {
        console.log("Error parsing byte stream", ex);
      }
    });
    return true;
  };

  const zipAndUpload = () => {
    setShowProgress(true);
    const zip = new JSZip();
    files.map((file, index) => zip.file(`${index}.dcm`, file));
    zip.generateAsync({ type: "blob" }).then((file) => {
      const formData = new FormData();
      formData.append("file", file, "archive.zip");
      axios
        .post("http://127.0.0.1:5000/upload", formData)
        .then((response) => {
          alert(response.data);
        })
        .catch((error) => {
          setShowProgress(false);
          alert(error);
        });
    });
  };

  return (
    <>
      {(!ct || !rtstruct || !rtdose) && <h2>Add:</h2>}
      <ul style={{ listStylePosition: "inside" }}>
        {!ct && <li>CT</li>}
        {!rtstruct && <li>RTSTRUCT </li>}
        {!rtdose && <li>RTDOSE </li>}
      </ul>
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
        {files.map((file) => `*${file.name}* `)}
      </Typography>
      <div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
        {showProgress && <CircularProgress />}
      </div>
      <Button
        disabled={files.length < 1 || !ct || !rtdose || !rtstruct}
        variant="contained"
        onClick={zipAndUpload}
      >
        Zip And Upload
      </Button>

      {/* It will be added to 2nd view */}
      <BasicSettings />
      <Divider />
      <RegionSettings />
    </>
  );
}
