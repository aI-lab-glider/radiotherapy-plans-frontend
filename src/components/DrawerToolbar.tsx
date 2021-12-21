import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import BasicSettings from "./BasicSettings";
import RegionSettings from "./RegionSettings";
import { setUploadedFiels } from "../actions/uploadActions";
import { UploadState } from "../reducers/uploadReducer";

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
      <BasicSettings />
      <Divider />
      <RegionSettings regions={[]} selectableRegions={regions} />
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
