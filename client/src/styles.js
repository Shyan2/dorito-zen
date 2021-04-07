import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    // minHeight: '100%',
    // height: 'calc(100vh - 64px)',
    // minWidth: '100%',
    paddingBottom: 0,
    paddingTop: '48px',
    paddingLeft: '56px',
    paddingRight: 0,
    flexGrow: 1,
  },

  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));
