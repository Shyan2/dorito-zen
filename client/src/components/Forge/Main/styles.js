import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  // root: {
  //   // height: 'calc(100vh - 64px)',
  //   // height: '100%',
  //   flexGrow: 1,
  //   // display: 'flex',
  //   // padding: theme.spacing(3),
  // },
  typography: {
    padding: 10,
    backgroundColor: '#d9d9d9',
  },
  tree: {
    // padding: theme.spacing(1, 3, 3, 3),
    flexGrow: 1,
  },
  paperRoot: {
    // maxHeight: '100vh',
    maxHeight: 'calc(100vh - 48px)',
    height: '80vh',
    // height: '100%',
    overflow: 'auto',
    backgroundColor: '#f2f2f2',
    boxShadow: theme.shadows[4],
  },
  paper: {
    position: 'absolute',
    width: '50vw',
    height: '90vh',
  },
  modelContainer: {
    // maxHeight: 'calc(100vh - 64px)',
    // padding: theme.spacing(3),
  },
  gridContainer: {
    // height: '50vh',
    padding: theme.spacing(3),
  },
}));

export default useStyles;
