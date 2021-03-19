import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '80vh',
    flexGrow: 1,
  },
  typography: {
    padding: 10,
    backgroundColor: '#d9d9d9',
  },
  tree: {
    padding: theme.spacing(1, 3, 3, 3),
    flexGrow: 1,
  },
  paperRoot: {
    height: '80vh',
    overflow: 'auto',
    backgroundColor: '#f2f2f2',
    boxShadow: theme.shadows[4],
  },
  paper: {
    position: 'absolute',
    width: '50vw',
    height: '70vh',
  },
}));

export default useStyles;
