import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import JSZip from "jszip";
import axios from "axios";

interface UploadProps {
  setInUploadView: Dispatch<SetStateAction<boolean>>;
}

export default function Upload({ setInUploadView }: UploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setFiles((curr) => [...curr, ...acceptedFiles]);
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
          setInUploadView(false);
        })
        .catch((error) => {
          setShowProgress(false);
          alert(error);
        });
    });
  };

  return (
    <>
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
        disabled={files.length < 1}
        variant="contained"
        onClick={zipAndUpload}
      >
        Zip And Upload
      </Button>
    </>
  );
}
