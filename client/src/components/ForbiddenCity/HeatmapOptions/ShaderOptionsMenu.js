import React, { useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ResolutionValueContext, SelectedPropertyIdContext, ShowHeatMapContext } from '../ForbiddenContext';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const CustomIconButton = withStyles({
  root: {
    paddingTop: '10px',
    height: '10px',
    '&:hover, &:focus': { background: 'none', outline: '0' },
    fill: '#353536',
    display: 'inline-block',
    marginTop: '15px',
    marginLeft: '-10px',
    pointerEvents: 'auto',
  },
})(IconButton);

const SensorCustomForm = withStyles({
  fullWidth: {
    width: 'fit-content',
  },
  root: {
    width: 'auto',
    pointerEvents: 'auto',
    '& .MuiFilledInput-input': {
      padding: '10px',
      paddingRight: '27px',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    },
    '& .MuiInputBase-root': {
      color: 'white',
      background: 'none',
    },
    '& .MuiFormControl-marginNormal': {
      background: '#2D2C2C',
      borderRadius: '5px',
    },
  },
})(FormControl);

const ResolutionCustomForm = withStyles({
  fullWidth: {
    width: 'fit-content',
  },
  root: {
    paddingLeft: '20px',
    paddingRight: '20px',
    width: 'auto',
    pointerEvents: 'auto',
    '& .MuiFilledInput-input': {
      padding: '10px',
      paddingRight: '27px',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    },
    '& .MuiInputBase-root': {
      color: 'white',
      background: 'none',
    },
    '& .MuiFormControl-marginNormal': {
      background: '#2D2C2C',
      borderRadius: '5px',
    },
  },
})(FormControl);

const ShaderOptionsMenu = (props) => {
  // const resolutionValue = props.resolutionValue;
  // const selectedPropertyId = props.selectedPropertyId;
  // const showHeatMap = props.showHeatMap;
  const { selectedPropertyId, setSelectedPropertyId } = useContext(SelectedPropertyIdContext);
  const { showHeatMap, setShowHeatMap } = useContext(ShowHeatMapContext);
  const { resolutionValue, setResolutionValue } = useContext(ResolutionValueContext);

  const handleHeatmapCheckboxChange = (event) => {
    setShowHeatMap((prevShowHeatMap) => !prevShowHeatMap);
  };

  const handleSensorTypeChange = (event) => {
    setSelectedPropertyId(event.target.value);
  };

  const handleResolutionChange = (event) => {
    setResolutionValue(event.target.value);
  };
  // function onResolutionChange(event) {
  //   if (props.onHeatmapOptionChange) {
  //     props.onHeatmapOptionChange({
  //       resolutionValue: event.target.value,
  //       selectedPropertyId,
  //       showHeatMap,
  //     });
  //   }
  // }

  function generateSensorProperties() {
    // Properties are currently hardcoded
    const allProperties = ['Temperature', 'Humidity', 'CO2'];
    return allProperties.map((propId) => {
      return (
        <MenuItem key={propId} value={propId}>
          {propId}
        </MenuItem>
      );
    });
  }

  function generateResolutions() {
    var resolutionOptionKeys = ['1 day', '6 hrs', '1 hr', '15 mins', '5 min'];
    var resolutionOptionVals = ['P1D', 'PT6H', 'PT1H', 'PT15M', 'PT5M'];

    return resolutionOptionKeys.map((option, index) => (
      <MenuItem key={option} value={resolutionOptionVals[index]}>
        {option}
      </MenuItem>
    ));
  }

  return (
    <div id='menuOptions' style={{ display: 'flex', pointerEvents: 'none' }}>
      <SensorCustomForm>
        <TextField
          select
          variant='filled'
          margin={'normal'}
          value={selectedPropertyId}
          onChange={(event) => handleSensorTypeChange(event)}
          InputProps={{ disableUnderline: true }}
        >
          {generateSensorProperties()}
        </TextField>
      </SensorCustomForm>

      <ResolutionCustomForm>
        <TextField
          select
          variant='filled'
          margin={'normal'}
          value={resolutionValue}
          onChange={(event) => handleResolutionChange(event)}
          InputProps={{ disableUnderline: true }}
        >
          {generateResolutions()}
        </TextField>
      </ResolutionCustomForm>
      <Tooltip title={showHeatMap ? 'Hide HeatMap' : 'Show HeatMap'}>
        <CustomIconButton id='showHeatMap' onClick={handleHeatmapCheckboxChange}>
          {showHeatMap ? (
            <VisibilityIcon style={{ fill: 'inherit' }} />
          ) : (
            <VisibilityOffIcon style={{ fill: 'inherit' }} />
          )}
        </CustomIconButton>
      </Tooltip>
    </div>
  );
};

export default ShaderOptionsMenu;
