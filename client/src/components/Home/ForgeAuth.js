/* global Autodesk */
import { useState, useEffect } from 'react';
import { Container, Grow, Grid, Button, Typography } from '@material-ui/core';

import useStyles from './styles';
import axios from 'axios';

// const SERVER_URL = 'http://localhost:9001';
// const SERVER_URL = 'https://my-forge-server.herokuapp.com';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const ForgeAuth = () => {
  const classes = useStyles();

  const [loginLink, setLoginLink] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const result = await axios.get(`${SERVER_URL}/api/forge/user/profile`, {
          withCredentials: true,
        });
        console.log(result);
        setUserName(result.data.name);
        return result.data;
      } catch (err) {
        console.log(err);
      }
    };

    const checkForUserProfile = async () => {
      const result = await getUserProfile();
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
    const newWindow = window.open('https://accounts.autodesk.com/Authentication/LogOut');

    setTimeout(() => {
      if (newWindow) {
        newWindow.close();
      }
    }, 500);
  };

  return (
    <Grid container className={classes.gridContainer} spacing={3}>
      {!isLoggedIn ? (
        <Grid item xs={12} sm={6} lg={4}>
          <Typography variant='h5' className={classes.typography} style={{ flex: 1 }} gutterBottom>
            You are not logged into an Autodesk account.
          </Typography>
          &nbsp;
          <Button
            variant='outlined'
            color='secondary'
            href={loginLink}
            onClick={() => {
              console.log('Login clicked!');
            }}
          >
            Login
          </Button>
        </Grid>
      ) : (
        <Grid item>
          <Typography variant='h5' className={classes.typography} style={{ flex: 1 }} gutterBottom>
            You are logged in as {userName}
          </Typography>
          <Button
            style={{ alignContent: 'flex-end', justify: 'flex-end' }}
            // className={classes.button}
            // variant='outlined'
            color='secondary'
            variant='outlined'
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
      )}
    </Grid>
  );
};

export default ForgeAuth;
