import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
  root: {
    width: '75%',
    zIndex: 1,
    display: 'flex',
    height: '10%',
    justifyContent: 'center',
    position: 'absolute',
    pointerEvents: 'none',
    top: '60px',
  },
});

export default useStyles;
