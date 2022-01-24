import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Header from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";
import DVH from "./components/DVH";
import { MeshWizard } from "./components/uploadComponent/MeshWizard";
import { UploadState } from "./reducers/uploadReducer";
import { ThreeCanvas } from "./components/canvas/ThreeCanvas";
import { DrawerTabs, TabsIdxs } from "./DrawerTabs";

export const DRAWER_WIDTH = 400;
export const APP_BAR_HEIGHT = 60;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      height: APP_BAR_HEIGHT,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    header: {
      display: "flex",
      alignItems: "center",
      height: APP_BAR_HEIGHT,
      justifyContent: "flex-end",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -DRAWER_WIDTH,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

export default function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [tabIndex, setTabIndex] = React.useState(0);

  const AreFilesUploaded = useSelector(
    (state: UploadState) => state.isFileUploaded
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Header>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Radiotherapy plans
          </Typography>
        </Header>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.header}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {AreFilesUploaded ? (
          <DrawerTabs onChange={handleTabChange} tabIndex={tabIndex} />
        ) : (
          <MeshWizard />
        )}
      </Drawer>

      {tabIndex === TabsIdxs.Mesh && (
        <ThreeCanvas appBarHeight={APP_BAR_HEIGHT} />
      )}
      {tabIndex === TabsIdxs.DVH && <DVH />}
    </>
  );
}
