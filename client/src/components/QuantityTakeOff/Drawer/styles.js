import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    // maxHeight: '100vh',
    height: 'calc(100vh - 48px)',
    // height: '80vh',
    // height: '100%',
    overflow: 'auto',
    backgroundColor: '#f2f2f2',
  },

  propertiesPaper: {
    overflow: 'scroll',
    position: 'absolute',
    width: '70vw',
    height: '85vh',
    backgroundColor: '#f2f2f2',
    boxShadow: theme.shadows[4],
  },
}));
