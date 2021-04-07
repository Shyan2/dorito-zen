import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Typography, Avatar, Button } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

import MenuDrawer from './MenuDrawer';

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

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
        </Toolbar>
        <Toolbar className={classes.toolbar}>
          {user ? (
            <div className={classes.profile}>
              <Avatar alt={user.result.name} src={user.result.imageUrl}>
                {user.result.name.charAt(0)}
              </Avatar>
              <Typography className={classes.userName} variant='h6'>
                {user.result.name}
                &nbsp;
              </Typography>

              <Button
                variant='contained'
                className={classes.logout}
                color='secondary'
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button component={Link} to='/auth'>
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
