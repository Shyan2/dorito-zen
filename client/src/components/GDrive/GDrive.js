import React, { useState, useEffect, useMemo } from 'react';
import { Container, Grid, Grow } from '@material-ui/core';
import useStyles from './styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import Viewer from './google-viewer';
import GDriveTree from './GDriveTree';
import FileInfo from './FileInfo';

import { GoogleUrnContext, SelectedFileContext } from './Context';

// const SERVER_URL = 'http://localhost:9001';
// const SERVER_URL = 'https://my-forge-server.herokuapp.com';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const GDrive = () => {
  const classes = useStyles();
  const [userInfo, setuserInfo] = useState(null);
  const [loginLink, setLoginLink] = useState();

  const [selectedFile, setSelectedFile] = useState(null);
  const [googleUrn, setGoogleUrn] = useState(null);

  const selectedFileValue = useMemo(() => ({ selectedFile, setSelectedFile }), [
    selectedFile,
    setSelectedFile,
  ]);
  const googleUrnValue = useMemo(() => ({ googleUrn, setGoogleUrn }), [googleUrn, setGoogleUrn]);

  useEffect(() => {
    getProfile();
    fetchLogin();
    // getDriveTree();
  }, []);

  const getProfile = async () => {
    try {
      const result = await axios.get(`${SERVER_URL}/api/google/profile`, {
        withCredentials: true,
      });
      console.log(result);
      setuserInfo(result?.data?.fullName);
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

  const signOut = async () => {
    try {
      const result = await axios.get(`${SERVER_URL}/api/google/logout`, {
        withCredentials: true,
      });

      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SelectedFileContext.Provider value={selectedFileValue}>
      <GoogleUrnContext.Provider value={googleUrnValue}>
        <Grow in>
          <Container maxWidth={false} className={classes.modelContainer}>
            <Grid container className={classes.gridContainer} spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={3}>
                <Paper className={classes.paperRoot} variant='outlined' width='1'>
                  <Typography className={classes.titleTypography} gutterBottom variant='h5'>
                    GDrive Integration
                  </Typography>
                  &nbsp;
                  <Container maxWidth={false}>
                    {!userInfo ? (
                      <Grid container align='center' justify='center' direction='column'>
                        <Grid item>
                          <Button
                            variant='outlined'
                            color='secondary'
                            href={loginLink}
                            startIcon={
                              <Avatar
                                src={
                                  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png'
                                }
                              />
                            }
                          >
                            Login with Google
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container justify='center' spacing={2}>
                        <Grid item xs={10}>
                          <Typography
                            variant='h5'
                            className={classes.typography}
                            style={{ flex: 1 }}
                            gutterBottom
                          >
                            {userInfo}
                          </Typography>
                        </Grid>
                        <Grid item container xs={2} justify='flex-end'>
                          <Button
                            style={{ alignContent: 'flex-end', justify: 'flex-end' }}
                            // variant='outlined'
                            color='secondary'
                            size='small'
                            onClick={() => {
                              signOut();
                            }}
                          >
                            Logout
                          </Button>
                        </Grid>

                        <Grid item sm={12}>
                          <FileInfo />
                        </Grid>

                        <Paper className={classes.subPaper} variant='outlined' width='1'>
                          <Grid item sm={12}>
                            <GDriveTree
                              // id={'0AGXMisIKi6EeUk9PVA'}
                              // id={'#'}
                              id={'#'}
                              name='My Drive'
                              icon={
                                'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder'
                              }
                            />
                            <GDriveTree
                              // id={'0AGXMisIKi6EeUk9PVA'}
                              // id={'#'}
                              id={'0AA59OTT24tAYUk9PVA'}
                              name='Drawing/Specification Database'
                              icon={
                                'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder'
                              }
                            />
                            <GDriveTree
                              id={'0AGXMisIKi6EeUk9PVA'}
                              name='CHG5 WSP'
                              icon={
                                'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder'
                              }
                            />
                          </Grid>
                        </Paper>
                      </Grid>
                    )}
                  </Container>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={9}>
                <Viewer />
              </Grid>
            </Grid>
          </Container>
        </Grow>
      </GoogleUrnContext.Provider>
    </SelectedFileContext.Provider>
  );
};

export default GDrive;
