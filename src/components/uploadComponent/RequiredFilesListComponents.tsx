import { Typography } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import React, { useMemo } from "react";
import styled from "styled-components";
import { SectionCaption } from "./styles";
import { RequiredFiles } from "./Upload";

export interface RequiredFilesListComponentsProps {
  requiredFiles: RequiredFiles;
}

export const StyledList = styled.ul`
  list-style-position: inside;
  padding: 0px;
`;

const OkIcon = styled(CheckCircleOutlineIcon)`
  font-size: 15;
  color: green;
`;
const MissingFileIcon = styled(CloseIcon)`
  font-size: 15;
  color: red;
`;

const FileRecord = styled.span`
  list-style: none;
  display: flex;
`;

export function RequiredFilesListComponents({
  requiredFiles,
}: RequiredFilesListComponentsProps) {
  const humanReadableDicomNames = useMemo(
    () => ({
      ctFiles: "Computer Tomography scans",
      rtStructFile: "Radiotherapy Structure",
      rtDoseFile: "Radiotherapy Doses",
    }),
    []
  );

  return (
    <>
      <SectionCaption variant="h6">Required DICOMs</SectionCaption>
      <StyledList>
        {Object.entries(requiredFiles).map(([key, value]) => (
          <Typography>
            <FileRecord key={key}>
              {value.length !== 0 ? <OkIcon /> : <MissingFileIcon />}
              {
                humanReadableDicomNames[
                  key as keyof typeof humanReadableDicomNames
                ]
              }
            </FileRecord>
          </Typography>
        ))}
      </StyledList>
    </>
  );
}
