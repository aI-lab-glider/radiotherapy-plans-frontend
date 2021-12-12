import { FileRejection, useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { DropzoneDiv, UploadIcon } from "./Upload.style";
import React, { useCallback, useRef } from "react";
import dicomParser from "dicom-parser";
import { Action } from "./reducer";
import { resetStudyUid } from "./utils";
import { setRegionTypes } from "../../actions/uploadActions";

const STUDY_INSTACE_UID_CODE = "x0020000d";
const MODALITY_CODE = "x00080060";
const REGION_TYPES_LIST_CODE = "x30060020";
const REGION_TYPE_CODE = "x30060026";

interface UploadDropzoneProps {
  localDispatch: React.Dispatch<Action>;
}

export default function UploadDropzone({ localDispatch }: UploadDropzoneProps) {
  const studyUid = useRef("");
  const globalDispatch = useDispatch();
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const parse = (file: File): boolean => {
        file.arrayBuffer().then((arrayBuffer) => {
          const byteArray = new Uint8Array(arrayBuffer);
          try {
            const dataSet = dicomParser.parseDicom(byteArray);
            const studyInstanceUid = dataSet.string(STUDY_INSTACE_UID_CODE);
            if (studyUid.current === "") {
              studyUid.current = studyInstanceUid;
            } else if (studyUid.current !== studyInstanceUid) {
              alert(
                "Files studyInstanceUid doesn't match. Files will be reset!"
              );
              resetStudyUid(studyUid, localDispatch);
              return false;
            }

            const modality = dataSet.string(MODALITY_CODE);

            if (modality === "RTSTRUCT") {
              let array = Array<string>();
              dataSet.elements[REGION_TYPES_LIST_CODE].items?.forEach(
                (item) => {
                  const regionType = item.dataSet?.string(REGION_TYPE_CODE);
                  if (typeof regionType !== "undefined") array.push(regionType);
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
    [globalDispatch, localDispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".dcm",
  });

  return (
    <DropzoneDiv {...getRootProps()}>
      <input {...getInputProps()} />
      <UploadIcon />
      <p>Choose a file or drag it here.</p>
    </DropzoneDiv>
  );
}
