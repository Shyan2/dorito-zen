import React from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import useStyles from './styles';

const PowerBI = () => {
  const classes = useStyles();
  return (
    <Container maxWidth={false} className={classes.container}>
      <iframe
        width='100%'
        height='100%'
        src='https://app.powerbi.com/reportEmbed?reportId=6589b79f-d2f3-442a-94dc-d0d944621445&autoAuth=true&ctid=3d234255-e20f-4205-88a5-9658a402999b&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWV1cm9wZS1ub3J0aC1iLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9'
        frameborder='0'
        allowFullScreen='true'
      ></iframe>
    </Container>
  );
};

export default PowerBI;
