import React, { useEffect } from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getToken } from '../../actions/forge';

import MyServices from './MyServices/MyServices';
import ForgeAuth from './ForgeAuth';
import ProjectSelection from './ProjectSelection';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getToken());
  }, []);

  // const CustomCard = ({ classes, image, title, subtitle }) => {
  //   return (
  //     <CardActionArea className={classes.actionArea}>
  //       <Card className={classes.card}>
  //         <CardMedia classes={classes.mediaStyles} image={image} />
  //         <CardContent className={classes.content}>
  //           <Typography className={classes.title} variant={'h2'}>
  //             {title}
  //           </Typography>
  //           <Typography className={classes.subtitle}>{subtitle}</Typography>
  //         </CardContent>
  //       </Card>
  //     </CardActionArea>
  //   );
  // };
  return (
    <Grow in>
      <Container>
        <Grid item>
          <ForgeAuth />
        </Grid>
        <Grid item>
          <ProjectSelection />
        </Grid>
        <Grid item>
          <MyServices />
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
