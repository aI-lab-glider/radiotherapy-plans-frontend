import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ThreeCanvas from "./components/ThreeCanvas";
import Upload from "./components/Upload";
import BasicSettings from "./components/BasicSettings";
import RegionSettings, { Region } from "./components/RegionSettings";

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
  const [brightness, setBrightness] = React.useState(50);
  const [cut, setCut] = React.useState(0);
  const [regions, setRegions] = React.useState<Array<Region>>([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

        <Upload />
        <BasicSettings
          brightness={brightness}
          cut={cut}
          onBrightnessChange={(event, newValue) =>
            setBrightness(newValue as number)
          }
          onCutChange={(event, newValue) => setCut(newValue as number)}
        />
        <Divider />
        <RegionSettings
          regions={regions}
          selectableRegions={["maxilla", "jawbone"]}
          onRegionsChange={(regions) => {
            setRegions(regions);
            console.log(regions[0].transparency);
          }}
        />
      </Drawer>

      <div className={classes.header} />
      <ThreeCanvas
        appBarHeight={appBarHeight}
        colorIntensity={brightness / 100}
        opacity={regions.length > 0 ? regions[0].transparency / 100 : 0.8}
        radius={cut / 50}
      />
    </div>
  );
}
