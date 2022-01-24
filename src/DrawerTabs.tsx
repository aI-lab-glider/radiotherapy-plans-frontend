import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import Toolbar from "./components/DrawerToolbar";
import { a11yProps, TabPanel } from "./components/TabPanel";

interface DrawerTabsProps {
  tabIndex: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const TabsIdxs = {
  Mesh: 0,
  DVH: 1,
};

export function DrawerTabs({ tabIndex, onChange }: DrawerTabsProps) {
  return (
    <Box component="div">
      <Box component="div">
        <Tabs value={tabIndex} onChange={onChange} centered>
          <Tab label="Visualization" {...a11yProps(TabsIdxs.Mesh)} />
          <Tab label="DVH" {...a11yProps(TabsIdxs.DVH)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={TabsIdxs.Mesh}>
        <Toolbar />
      </TabPanel>
      <TabPanel value={tabIndex} index={TabsIdxs.DVH}>
        DVH of the structures
      </TabPanel>
    </Box>
  );
}
