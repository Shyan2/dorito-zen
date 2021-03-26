import React, { useState, useEffect, useContext } from 'react';
import { SelectedPropertyIdContext } from '../ForbiddenContext';
import useStyles from './styles';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const PropIdGradientMap = {
  temperature: [0x0000ff, 0x00ff00, 0xffff00, 0xff0000],
  humidity: [0x00f260, 0x0575e6],
  co2: [0x1e9600, 0xfff200, 0xff0000],
};

const useSliderStyle = makeStyles({
  rail: {
    backgroundImage: (props) => props.backgroundImage,
    height: '10px',
    opacity: '1',
    left: 0,
    borderRadius: '10px',
  },
  mark: {
    backgroundColor: '#ffffff33',
    height: 10,
    width: 1,
    left: 0,
  },
  root: {
    width: '30%',
    margin: '1%',
    marginTop: '20px',
    '& .MuiSlider-markLabel': {
      color: '#000000',
    },
  },
  thumb: {
    display: 'none',
  },
});

const ShaderSlider = (props) => {
  const { selectedPropertyId } = useContext(SelectedPropertyIdContext);
  // const selectedPropertyIdVal = 'Temperature';

  const [sliderMarks, setSliderMarks] = useState([
    { value: 20, label: '1' },
    { value: 40, label: '2' },
    { value: 60, label: '3' },
    { value: 80, label: '4' },
  ]);

  const generateGradientStyle = (propIdGradientMap, propertyId) => {
    let colorStops = propIdGradientMap[propertyId];
    colorStops = colorStops ? colorStops : [0xf9d423, 0xff4e50]; // Default colors.

    const colorStopsHex = colorStops.map((c) => `#${c.toString(16).padStart(6, '0')}`);
    return `linear-gradient(.25turn, ${colorStopsHex.join(', ')})`;
  };

  const generateMarks = (propertyId) => {
    let localMarks = [];
    const totalMarkers = props.totalMarkers ? props.totalMarkers : 4; // Generate [1, 2, 3, ..., totalMarkers ]
    const seeds = Array.from({ length: totalMarkers }, (_, x) => x + 1);
    const valueOffset = 100.0 / (totalMarkers + 1.0);

    // Get the selected property's range min, max and dataUnit value from Ref App
    // let propertyInfo = props.getPropertyRanges(propertyId);
    let propertyInfo = '';
    switch (propertyId) {
      case 'temperature':
        propertyInfo = {
          rangeMin: 0,
          rangeMax: 30,
          dataUnit: '℃',
        };
        break;
      case 'humidity':
        propertyInfo = {
          rangeMin: 0,
          rangeMax: 44,
          dataUnit: '%RH',
        };
        break;
      case 'co2':
        propertyInfo = {
          rangeMin: 500,
          rangeMax: 650,
          dataUnit: 'ppm',
        };
        break;
      default:
        propertyInfo = {
          rangeMin: 0,
          rangeMax: 100000,
          dataUnit: 'NA',
        };
        break;
    }

    const delta = (propertyInfo.rangeMax - propertyInfo.rangeMin) / (totalMarkers + 1.0);
    localMarks = seeds.map((i) => {
      return {
        value: i * valueOffset,
        label: `${(propertyInfo.rangeMin + i * delta).toFixed()}${propertyInfo.dataUnit}`,
      };
    });
    return localMarks;
  };
  const rail = useSliderStyle({
    backgroundImage: generateGradientStyle(PropIdGradientMap, selectedPropertyId),
  });

  useEffect(() => {
    // Re-generate slider marks based on the selected property type.
    setSliderMarks(generateMarks(selectedPropertyId));
  }, [selectedPropertyId]);

  return (
    <Slider
      classes={rail}
      valueLabelDisplay='off'
      marks={sliderMarks}
      track={false}
      disabled={true}
    />
  );
};

export default ShaderSlider;
