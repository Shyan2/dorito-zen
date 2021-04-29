import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

const CreateIssueForm = () => {
  const classes = useStyles();
  const [issueData, setIssueData] = useState({
    title: '',
    description: '',
    selectedFile: '',
    assignedTo: '',
  });

  const clear = () => {
    setIssueData({
      title: '',
      description: '',
      selectedFile: '',
      assignedTo: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(issueData);
    // send to mongodb
    // need to add a createdBy
    const result = await axios.post('http://localhost:9001/issues', issueData);
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
        {/* <TextField
          name='selectedFile'
          variant='outlined'
          label='Selected File'
          fullWidth
          value={issueData.selectedFile}
          onChange={(e) => setIssueData({ ...issueData, selectedFile: e.target.value })}
        /> */}

        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={issueData.selectedFile}
          onChange={(e) => setIssueData({ ...issueData, selectedFile: e.target.value })}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>

        <Button
          className={classes.buttonSubmit}
          variant='contained'
          color='primary'
          size='large'
          type='submit'
          fullWidth
        >
          Submit
        </Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default CreateIssueForm;
