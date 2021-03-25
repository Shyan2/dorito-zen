import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: 0,
    paddingTop: '64px',
    // paddingLeft: theme.spacing(4),
    paddingLeft: '56px',
    paddingRight: 0,
    display: 'flex',
  },

  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));
