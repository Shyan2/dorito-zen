import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(10),
    paddingTop: theme.spacing(10),
    paddingLeft: theme.spacing(7),
    display: 'flex',
  },
}));
