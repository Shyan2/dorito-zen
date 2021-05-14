import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#373737',
    fontSize: '12px',
    padding: '0px',
    paddingTop: '2px',
    paddingBottom: '3px',
    margin: '0px',
  },
  arrow: {
    color: '#373737',
    marginBottom: '0px',
    fontSize: '20px',
  },
}))(Tooltip);

const CustomToolTip = (props) => {
  if (props.hoveredDeviceInfo.id) {
    // console.log('entered!', props);
    return (
      <HtmlTooltip
        title={props.hoveredDeviceInfo.title}
        arrow={true}
        placement='top'
        open={Boolean(props.hoveredDeviceInfo.title)}
      >
        <span
          id='tooltip'
          style={{
            position: 'absolute',
            left: `${props.hoveredDeviceInfo.xcoord + 57}px`,
            top: `${props.hoveredDeviceInfo.ycoord + 5}px`,
            zIndex: 2,
          }}
        ></span>
      </HtmlTooltip>
    );
  }
  return null;
};

export default CustomToolTip;
