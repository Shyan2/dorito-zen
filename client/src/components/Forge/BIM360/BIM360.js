/* global Autodesk */
import { useEffect, useState } from 'react';
import axios from 'axios';
import BIMTree from './BIMTree';

import { Container, Grid, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const SERVER_URL = 'http://localhost:9001';
// const SERVER_URL = 'https://bimwip.herokuapp.com';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(1, 1, 0, 0),
  },
  tree: {
    padding: theme.spacing(1, 3, 3, 3),
    flexGrow: 1,
  },
}));
const BIM360 = () => {
  const classes = useStyles();

  const [loginLink, setLoginLink] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState();

  useEffect(() => {
    const checkForUserProfile = async () => {
      const result = await getUserProfile();
      console.log(result);
      if (result?.statusCode === 401) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    };
    checkForUserProfile();
  }, []);

  useEffect(() => {
    const fetchLoginLink = async () => {
      try {
        const result = await axios.get(`${SERVER_URL}/api/forge/oauth/url`);
        console.log(result);
        setLoginLink(result.data);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    fetchLoginLink();
  }, []);

  const logOutAutodesk = async () => {
    setIsLoggedIn(false);
    try {
      await axios.get(`${SERVER_URL}/api/forge/oauth/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
    const newWindow = window.open(
      'https://accounts.autodesk.com/Authentication/LogOut'
    );

    setTimeout(() => {
      if (newWindow) {
        newWindow.close();
      }
    }, 500);
  };

  const getUserProfile = async () => {
    try {
      const result = await axios.get(`${SERVER_URL}/api/forge/user/profile`, {
        withCredentials: true,
      });
      setUserName(result.data.name);
      return result.data;
    } catch (err) {
      console.log(err);
    }
  };

  const linkRoute =
    'https://developer.api.autodesk.com/project/v1/hubs/b.8a331102-468b-4ecd-a5c3-64c7b5c855ab'; // hub folder ('#')

  return (
    <Container maxWidth={false}>
      {!isLoggedIn ? (
        <Grid container align='center' justify='center' direction='column'>
          <Grid item>
            <Typography
              className={classes.typography}
              variant='h5'

              // align='center'
            >
              Please login to your Autodesk account.
            </Typography>
          </Grid>
          &nbsp;
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              href={loginLink}
              onClick={() => {
                console.log('Login clicked!');
              }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Grid item sm={10}>
            <Typography className={classes.typography} variant='h5'>
              {userName}
            </Typography>
          </Grid>
          <Grid item sm={2}>
            <Button
              className={classes.button}
              variant='outlined'
              color='secondary'
              size='small'
              onClick={() => {
                let viewer = window.NOP_VIEWER;
                if (viewer) {
                  viewer.finish();
                  viewer = null;
                  Autodesk.Viewing.shutdown();
                }
                logOutAutodesk();
              }}
            >
              Logout
            </Button>
          </Grid>
          <Grid item sm={12}>
            <BIMTree id={linkRoute} name='Root' />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BIM360;
