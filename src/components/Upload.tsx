import { Button, CircularProgress, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import dicomParser from "dicom-parser";
import JSZip from "jszip";
import React, { useCallback, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import BasicSettings from "./BasicSettings";
import RegionSettings from "./RegionSettings";

export default function Upload() {
  const [ctFiles, setCtFiles] = useState<File[]>([]);
  const [rtstructFiles, setRtstructFiles] = useState<File[]>([]);
  const [rtdoseFiles, setRtdoseFiles] = useState<File[]>([]);
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
            setCtFiles([]);
            setRtdoseFiles([]);
            setRtstructFiles([]);
            studyUid.current = "";
            return false;
          }
        }
        const modality = dataSet.string("x00080060");
        switch (modality) {
          case "CT":
            setCtFiles((curr) => [...curr, file]);
            break;
          case "RTSTRUCT":
            setRtstructFiles((curr) => [...curr, file]);
            break;
          case "RTDOSE":
            setRtdoseFiles((curr) => [...curr, file]);
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
    const ct = zip.folder("ct");
    const rtdose = zip.folder("rtdose");
    const rtstruct = zip.folder("rtstruct");
    ctFiles.map((file, index) => ct?.file(`${index}.dcm`, file));
    rtdoseFiles.map((file, index) => rtdose?.file(`${index}.dcm`, file));
    rtstructFiles.map((file, index) => rtstruct?.file(`${index}.dcm`, file));
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
      {(!ctFiles.length || !rtstructFiles.length || !rtdoseFiles.length) && (
        <h2>Add:</h2>
      )}
      <ul style={{ listStylePosition: "inside" }}>
        {!ctFiles.length && <li>CT</li>}
        {!rtstructFiles.length && <li>RTSTRUCT </li>}
        {!rtdoseFiles.length && <li>RTDOSE </li>}
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
        {rtdoseFiles.map((file) => `*${file.name}* `)}
        {rtstructFiles.map((file) => `*${file.name}* `)}
        {ctFiles.map((file) => `*${file.name}* `)}
      </Typography>
      <div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
        {showProgress && <CircularProgress />}
      </div>
      <Button
        disabled={
          !ctFiles.length || !rtdoseFiles.length || !rtstructFiles.length
        }
        variant="contained"
        onClick={zipAndUpload}
      >
        Zip And Upload
      </Button>

      {/* It will be added to 2nd view */}
      <BasicSettings />
      <Divider />
      <RegionSettings regions={[]} selectableRegions={["maxilla", "jawbone"]} />
    </>
  );
}
