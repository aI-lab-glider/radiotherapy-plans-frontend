import styled from "styled-components";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

export const StyledList = styled.ul`
  list-style-position: inside;
`;

export const ProgressDiv = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`;

export const ContainerDiv = styled.div`
  margin-right: 10px;
  margin-left: 10px;
`;

export const DropzoneDiv = styled.div`
  margin: 10px;
  padding: 40px;
  background-color: #f1f1f1;
  border-style: dashed;
  text-align: center;
`;

export const UploadButton = styled(Button)`
  margin-left: 20;
  margin-right: 20;
`;

export const UploadIcon = styled(CloudUploadIcon)`
  font-size: 70px;
`;

export const CheckIcon = styled(CheckCircleOutlineIcon)`
  font-size: 15px;
  color: green;
`;
