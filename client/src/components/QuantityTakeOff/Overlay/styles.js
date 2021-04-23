import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  popper: {
    zIndex: 2,
    // maxHeight: '600px',
    overflowY: 'auto',

    borderRadius: '7px',
    '&[x-placement*="right"] $arrow': {
      left: '300px',
      height: '100px',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: 'transparent #373737 transparent transparent',
      },
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '4em',
    height: '4em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  customHoverFocus: {
    '&:hover, &:focus': { fill: '#00bfff' },
    fill: 'white',
  },
  root: {
    zIndex: 2,
    position: 'absolute',
    top: '70px',
    left: '80px',
    backgroundColor: '#373737',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
}));
