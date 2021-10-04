import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import BasicSettings from "./BasicSettings";
import RegionSettings from "./RegionSettings";
import { resetUploadedFiles } from "../actions/uploadActions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resetButton: {
      margin: 20,
    },
  })
);

const DrawerToolbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <>
      <BasicSettings />
      <Divider />
      <RegionSettings regions={[]} selectableRegions={["maxilla", "jawbone"]} />
      <Divider />
      <Button
        color="secondary"
        variant="contained"
        className={classes.resetButton}
        onClick={() => dispatch(resetUploadedFiles())}
      >
        Reset Uploaded Files
      </Button>
    </>
  );
};

export default DrawerToolbar;
