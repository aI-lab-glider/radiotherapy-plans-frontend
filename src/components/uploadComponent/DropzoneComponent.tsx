import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import React from "react";
import { FileRejection, useDropzone } from "react-dropzone";

export interface DropzoneComponentProps {
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
}

export function DropzoneComponent({ onDrop }: DropzoneComponentProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".dcm",
  });
  return (
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
  );
}
