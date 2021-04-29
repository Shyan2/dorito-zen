import React, { useEffect } from 'react';
import { Container, Grow, Grid, Typography } from '@material-ui/core';
import Service from './Service';
import useStyles from '../styles';

const items = [
  {
    id: 1,
    name: 'View Models',
    image: 'IMG',
    path: '/models',
  },
  { id: 2, name: 'PowerBI + BIM', image: 'IMG', path: '/powerBI' },
  { id: 3, name: 'Forbidden City Project', image: 'IMG', path: '/forbiddenCity' },
  { id: 4, name: 'GDrive Integration', image: 'IMG', path: '/gdrive' },
  { id: 5, name: 'Quantity Take Off POC', image: 'IMG', path: '/qto' },
  { id: 6, name: 'Issues', image: 'IMG', path: '/issues' },
];

const MyServices = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.gridContainer} spacing={3}>
      <Grid item xs={12}>
        <Typography variant='h1'>Services</Typography>
      </Grid>

      {items.map((item) => (
        <Grid item xs={12} sm={6} lg={4} key={item.id}>
          <Service item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MyServices;
