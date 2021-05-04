import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const CreateIssueForm = ({ newCreatedElement }) => {
  const classes = useStyles();

  const [googleUser, setGoogleUser] = useState(null);
  const [issueData, setIssueData] = useState({
    id: '',
    title: '',
    description: '',
    selectedFile: '',
    assignedTo: '',
    xpos: '',
    ypos: '',
    zpos: '',
  });
  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await axios.get(`${SERVER_URL}/api/google/profile`, {
          withCredentials: true,
        });
        console.log(result.data);
        setGoogleUser(result?.data?.googleId);
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
  }, []);
  useEffect(() => {
    if (newCreatedElement !== {}) {
      setIssueData({
        id: '',
        title: '',
        description: '',
        selectedFile: '',
        assignedTo: '',
        xpos: newCreatedElement?.position?.x,
        ypos: newCreatedElement?.position?.y,
        zpos: newCreatedElement?.position?.z,
      });
    }
  }, [newCreatedElement]);

  const clear = () => {
    setIssueData({
      id: '',
      title: '',
      description: '',
      selectedFile: '',
      assignedTo: '',
      xpos: '',
      ypos: '',
      zpos: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(issueData);
    console.log(googleUser);
    // send to mongodb
    // need to add a createdBy
    const result = await axios.post('http://localhost:9001/issues', { ...issueData, googleUser });
    console.log(result);
    clear();
  };

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete='off'
        noValidate
        className={`${classes.form} ${classes.root}`}
        onSubmit={handleSubmit}
      >
        <Typography variant='h6'>Create a new Issue</Typography>
        <TextField
          name='id'
          variant='outlined'
          label='ID'
          fullWidth
          value={issueData.id}
          onChange={(e) => setIssueData({ ...issueData, id: e.target.value })}
        />
        <TextField
          name='title'
          variant='outlined'
          label='Title'
          fullWidth
          value={issueData.title}
          onChange={(e) => setIssueData({ ...issueData, title: e.target.value })}
        />
        <TextField
          name='description'
          variant='outlined'
          label='Description'
          fullWidth
          value={issueData.description}
          onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
        />
        <TextField
          name='assignedTo'
          variant='outlined'
          label='Assign to'
          fullWidth
          value={issueData.assignedTo}
          onChange={(e) => setIssueData({ ...issueData, assignedTo: e.target.value })}
        />
        <TextField
          name='xpos'
          variant='outlined'
          label='X'
          fullWidth
          value={issueData.xpos}
          onChange={(e) => setIssueData({ ...issueData, xpos: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name='ypos'
          variant='outlined'
          label='Y'
          fullWidth
          value={issueData.ypos}
          onChange={(e) => setIssueData({ ...issueData, ypos: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name='zpos'
          variant='outlined'
          label='Z'
          fullWidth
          value={issueData.zpos}
          onChange={(e) => setIssueData({ ...issueData, zpos: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={issueData.selectedFile}
          fullWidth
          onChange={(e) => setIssueData({ ...issueData, selectedFile: e.target.value })}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem
            value={
              'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwLW1haW4tb2ZmaWNlLyVFNSU4RiVCMCVFNSU4QyU5NyVFOCVCQiU4QSVFNyVBQiU5OSVFOCVCRSVBOCVFNSU4NSVBQyVFNSVBRSVBNC5ydnQ'
            }
          >
            Model 1
          </MenuItem>
        </Select> */}

        <Button
          className={classes.buttonSubmit}
          variant='contained'
          color='primary'
          size='large'
          type='submit'
          fullWidth
        >
          Create Issue
        </Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default CreateIssueForm;
