import { Typography } from "@material-ui/core";
import { CheckIcon, StyledList } from "./Upload.style";
import { State } from "./reducer";

interface UploadListProps {
  state: State;
}

export default function UploadList({ state }: UploadListProps) {
  return (
    <>
      <Typography>
        <h2>Upload files</h2>
      </Typography>
      {Object.values(state).some((value) => value.length === 0) && (
        <Typography>Add following files:</Typography>
      )}
      <StyledList>
        {Object.entries(state).map(([key, value]) => (
          <li>
            {value.length !== 0 && <CheckIcon />} {key}{" "}
          </li>
        ))}
      </StyledList>
    </>
  );
}
