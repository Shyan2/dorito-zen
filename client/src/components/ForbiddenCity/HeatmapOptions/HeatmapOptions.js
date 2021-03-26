import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  ResolutionValueContext,
  SelectedPropertyIdContext,
  ShowHeatMapContext,
} from '../ForbiddenContext';
import useStyles from './styles';

import ShaderSlider from './ShaderSlider';
import ShaderOptionsMenu from './ShaderOptionsMenu';

const HeatmapOptions = () => {
  const classes = useStyles();

  const { selectedPropertyIdVal } = useContext(SelectedPropertyIdContext);

  useEffect(() => {
    console.log(selectedPropertyIdVal);
  }, [selectedPropertyIdVal]);

  return (
    <div className={classes.root}>
      <ShaderSlider />
      <ShaderOptionsMenu />
    </div>
  );
};

export default HeatmapOptions;
