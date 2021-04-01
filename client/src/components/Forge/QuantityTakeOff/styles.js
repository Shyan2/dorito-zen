import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: 'scroll',
    position: 'absolute',
    width: '50vw',
    height: '80vh',
    backgroundColor: '#f2f2f2',
    boxShadow: theme.shadows[4],
  },
}));

export default useStyles;
