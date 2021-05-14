import React, { useState, useEffect, useContext } from 'react';
import useStyles from './styles';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Typography, Avatar, Button } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

import MenuDrawer from './MenuDrawer';

import axios from 'axios';
import { ProjectIdContext } from '../../Context';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const [googleUser, setGoogleUser] = useState(null);
  const [loginLink, setLoginLink] = useState(null);

  const { projectId } = useContext(ProjectIdContext);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    history.push('/');
    setUser(null);
  };

  const switchDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await axios.get(`${SERVER_URL}/api/google/profile`, {
          withCredentials: true,
        });
        console.log(result.data);
        if (result?.data?.code !== 401) {
          setGoogleUser(result.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
    fetchLogin();
  }, []);

  const signOut = async () => {
    setGoogleUser(null);
    try {
      const result = await axios.get(`${SERVER_URL}/api/google/logout`, {
        withCredentials: true,
      });

      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLogin = async () => {
    try {
      const result = await axios.get(`${SERVER_URL}/api/google/oauth/url`);
      console.log(result);
      setLoginLink(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            className={classes.menuButton}
            onClick={switchDrawer}
            edge='start'
          >
            <MenuIcon />
          </IconButton>
          <Typography component={Link} to='/' className={classes.heading} variant='h5'>
            Project BIM
          </Typography>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Typography className={classes.heading} variant='h5'>
            {projectId.id ? projectId.id + ' - ' + projectId.name : 'No Project selected'}
          </Typography>
        </Toolbar>
        <Toolbar className={classes.toolbar}>
          {googleUser ? (
            <div className={classes.profile}>
              <Avatar alt={googleUser.fullName} src={googleUser.picture}>
                {googleUser?.fullName?.charAt(0)}
              </Avatar>
              <Typography className={classes.userName} variant='h6'>
                {googleUser.fullName}
                &nbsp;
              </Typography>

              <Button
                variant='contained'
                className={classes.logout}
                color='secondary'
                onClick={signOut}
              >
                Logout
              </Button>
            </div>
          ) : (
            // <Button component={Link} to='/auth'>
            <Button href={loginLink}>
              <Typography variant='h6' className={classes.heading}>
                Sign in
              </Typography>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <MenuDrawer open={open} />
    </div>
  );
};

export default Navbar;
