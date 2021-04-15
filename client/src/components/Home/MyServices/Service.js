import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import useStyles from '../styles';
import { Link } from 'react-router-dom';

const Service = ({ item }) => {
  const classes = useStyles();
  console.log(item);
  return (
    <Link to={item.path}>
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom>{item.name}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Service;
