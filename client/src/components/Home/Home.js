import React, { useEffect } from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getToken } from '../../actions/forge';

const Home = () => {
  const dispatch = useDispatch();

  // TODO: only dispatch if token is expiring.
  // currently the token is fetched at every refresh
  useEffect(() => {
    dispatch(getToken());
  }, []);

  return (
    <Grow in>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          Home page
        </Grid>
      </Grid>
    </Grow>
  );
};

export default Home;
