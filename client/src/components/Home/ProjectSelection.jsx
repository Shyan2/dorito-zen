import React, { useState, useContext } from 'react';
import { Container, Grow, Grid, Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useStyles from './styles';

import { ProjectIdContext } from '../../Context';

const projects = [
  { name: 'All', id: '1', bim360Link: '#' },
  {
    name: '華銀資訊大樓新建工程-Tier電腦機房暨大樓 機電工程(專業分包)專案',
    id: '2800373A',
    bim360Link:
      'https://developer.api.autodesk.com/project/v1/hubs/b.8a331102-468b-4ecd-a5c3-64c7b5c855ab/projects/b.d2fd1849-ed20-4fa5-97bb-da0bd1027fca',
    forgeBucket: '',
  },
  {
    name: '臺南市先進運輸系統第一期藍線綜合規劃技術服務',
    id: '2800371A',
    bim360Link: '',
    forgeBucket: '',
  },
  { name: '新北市錦和運動公園停車場新建統包工程', id: '2800380A', bim360Link: '', forgeBucket: '' },
  {
    name: '新北市社會住宅新建統包工程-江翠A案',
    id: '2800394A',
    bim360Link:
      'https://developer.api.autodesk.com/project/v1/hubs/b.d3dba49b-77c5-4333-8ab6-527e3ee08d58/projects/b.c66263b8-06da-4a8d-aa9b-446454727c2f',
    forgeBucket: '',
  },
  {
    name: '警用無線電汰換更新委託規劃設計暨監造案',
    id: '2800397A',
    bim360Link: '',
    forgeBucket: '',
  },
  {
    name: '警消微波通訊系統移頻更新委託規劃設計暨監造服務案',
    id: '2800450A',
    bim360Link: '',
    forgeBucket: '',
  },
];
const ProjectSelection = () => {
  const classes = useStyles();

  const { projectId, setProjectId } = useContext(ProjectIdContext);

  const handleChange = (event) => {
    const selectedProject = projects.find((x) => x.id === event.target.value);
    console.log(selectedProject);
    setProjectId(selectedProject);
  };

  return (
    <Grid container className={classes.gridContainer} spacing={3}>
      <Grid item xs={12}>
        <Typography variant='h1'>Project Selection</Typography>
        <FormControl variant='filled' className={classes.formControl}>
          <InputLabel id='demo-simple-select-filled-label'>Select Project</InputLabel>
          <Select
            labelId='demo-simple-select-filled-label'
            id='demo-simple-select-filled'
            defaultValue={''}
            onChange={handleChange}
          >
            {projects.map((project) => {
              return (
                <MenuItem key={project.id} value={project.id}>
                  {project.id + ' - ' + project.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ProjectSelection;
