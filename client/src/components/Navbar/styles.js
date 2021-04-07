import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;
export default makeStyles((theme) => ({
  appBar: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f53528',
    minHeight: 48,
    // padding: '10px 50px',
  },
  root: {
    display: 'flex',
  },
  // appBar: {
  //   zIndex: theme.zIndex.drawer + 1,
  //   transition: theme.transitions.create(['width', 'margin'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  // },

  heading: {
    color: '#f2f2f2',
    textDecoration: 'none',
  },
  toolbar: {
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',

    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
  },
  menuButton: {
    // marginRight: 36,
    marginRight: theme.spacing(2),
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    // whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.down('xs')]: {
      // width: theme.spacing(5) + 1,
      width: 0,
    },
  },
  image: {
    marginLeft: '15px',
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '250px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
  },
}));
