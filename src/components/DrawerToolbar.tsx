import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUploadedFiels } from "../actions/uploadActions";
import { UploadState } from "../reducers/uploadReducer";
import RegionSettings from "./regionSettings/RegionSettings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resetButton: {
      margin: 20,
    },
  })
);

const Toolbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const regions = useSelector((state: UploadState) => state.regionTypes);
  return (
    <>
      <RegionSettings regions={regions} />
      <Divider />
      <Button
        color="secondary"
        variant="contained"
        className={classes.resetButton}
        onClick={() =>
          dispatch(
            setUploadedFiels({
              isSuccess: false,
            })
          )
        }
      >
        Reset Uploaded Files
      </Button>
    </>
  );
};

export default Toolbar;
