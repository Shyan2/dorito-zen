import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import useStyles from './styles';
import TestChart from '../Charts/TestChart';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import TakeOff from './TakeOff';
import MainTab from './MainTab';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Drawer = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        indicatorColor='primary'
        textColor='primary'
        onChange={handleChange}
        aria-label='tabs'
        variant='fullWidth'
      >
        <Tab label='Main' />
        <Tab label='Table' />
        <Tab label='Tab 2' />
      </Tabs>
      <TabPanel value={value} index={0}>
        <MainTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TakeOff />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Empty
      </TabPanel>
    </div>
  );
};

export default Drawer;
