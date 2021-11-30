import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ThreeCanvas from "./components/ThreeCanvas/ThreeCanvas";
import DVH from "./components/DVH/DVH";
import Upload from "./components/Upload";
import DrawerToolbar from "./components/DrawerToolbar/DrawerToolbar";
import { UploadState } from "./reducers/uploadReducer";
import { TabPanel, a11yProps } from "./components/TabPanel/TabPanel";

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

  const isFileUploaded = useSelector(
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
        <Toolbar>
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
        </Toolbar>
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
        {isFileUploaded ? (
          <Box>
            <Box>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab label="Visualization" {...a11yProps(TABS.VISUALIZATION)} />
                <Tab label="DVH" {...a11yProps(TABS.DVH)} />
              </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={TABS.VISUALIZATION}>
              <DrawerToolbar />
            </TabPanel>
            <TabPanel value={tabIndex} index={TABS.DVH}>
              DVH of the structures
            </TabPanel>
          </Box>
        ) : (
          <Upload />
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
