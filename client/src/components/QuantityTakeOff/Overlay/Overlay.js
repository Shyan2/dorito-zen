import React, { useState, useEffect, useRef } from 'react';
import usestyles from './styles';
import { Popper, IconButton, Typography } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import LayersIcon from '@material-ui/icons/Layers';

import LevelsTree from './LevelsTree';
import LevelSelector from './LevelSelector';
import useStyles from './styles';

const Overlay = () => {
  const classes = useStyles();
  return (
    // <div id='toolContainer'>
    <div className={classes.root}>
      <LevelSelector />
    </div>
  );
};

export default Overlay;
