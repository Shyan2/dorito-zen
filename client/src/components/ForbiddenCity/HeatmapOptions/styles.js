import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
  root: {
    width: '50%',
    zIndex: 1,
    display: 'flex',
    // height: '10%',
    justifyContent: 'center',
    position: 'absolute',
    pointerEvents: 'none',
    top: '50px',
  },
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

  thumb: {
    display: 'none',
  },

  sliderRoot: {
    width: '30%',
    margin: '1%',
    marginTop: '20px',
    '& .MuiSlider-markLabel': {
      color: '#000000',
    },
  },
});

export default useStyles;
