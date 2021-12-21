import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Header from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";
import Toolbar from "./components/DrawerToolbar";
import DVH from "./components/DVH";
import { a11yProps, TabPanel } from "./components/TabPanel";
import { MeshWizard } from "./components/uploadComponent/MeshWizard";
import { UploadState } from "./reducers/uploadReducer";
import { ThreeCanvas } from "./components/canvas/ThreeCanvas"

const drawerWidth = 360;
const appBarHeight = 60;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      height: appBarHeight,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    header: {
      display: "flex",
      alignItems: "center",
      height: appBarHeight,
      justifyContent: "flex-end",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
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
  const TABS = {
    VISUALIZATION: 0,
    DVH: 1,
  };

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
    <div>
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
          <Box>
            <Box>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                centered
              >
                <Tab label="Visualization" {...a11yProps(TABS.VISUALIZATION)} />
                <Tab label="DVH" {...a11yProps(TABS.DVH)} />
              </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={TABS.VISUALIZATION}>
              <Toolbar />
            </TabPanel>
            <TabPanel value={tabIndex} index={TABS.DVH}>
              DVH of the structures
            </TabPanel>
          </Box>
        ) : (
          <MeshWizard />
        )}
      </Drawer>

      <div className={classes.header} />
      {tabIndex === TABS.VISUALIZATION && (
        <ThreeCanvas appBarHeight={appBarHeight} />
      )}
      {tabIndex === TABS.DVH && <DVH />}
    </div>
  );
}
