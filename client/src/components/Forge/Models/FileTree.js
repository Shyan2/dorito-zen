import React, { useState, useEffect, useContext } from 'react';
import { UrnContext } from '../Context';
import useStyles from './styles';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Container, Grow, Grid } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Loader from '../../Utils/Loader';
import BIM360 from '../BIM360/BIM360';

const FileTree = () => {
  const classes = useStyles();

  const [tree, setTree] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { setUrn } = useContext(UrnContext);

  // TEST TRIAL ----------------------
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  // END TEST TRIAL -------------

  useEffect(() => {
    setIsLoading(true);
    const getTree = async () => {
      let returnArray = [];
      const result = await axios.get(
        // 'https://bimwip.herokuapp.com/api/forge/oss/buckets'
        'http://localhost:9001/api/forge/buckets'
      );

      for (let i = 0; i < result.data.length; i++) {
        const childrenResult = await axios.get(
          // `https://bimwip.herokuapp.com/api/forge/oss/buckets/?id=${result.data[i].id}`
          `http://localhost:9001/api/forge/buckets/?id=${result.data[i].id}`
        );

        let returnObject = {
          id: result.data[i].id,
          text: result.data[i].text,
          children: childrenResult.data,
        };
        returnArray.push(returnObject);
      }
      setTree(returnArray);
      setIsLoading(false);
    };
    getTree();
  }, []);

  const selectIcon = (hasChildren) => {
    if (hasChildren) {
      return <FolderIcon />;
    } else {
      return <InsertDriveFileIcon />;
    }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.text}
      icon={selectIcon(nodes.children)}
      onClick={() => {
        if (nodes.text === '錦和運動公園停車場_動畫_20210304.mp4') {
          console.log('Is video!');
          handleOpen();
        } else if (!nodes.children) {
          console.log(nodes);
          setUrn(nodes.id);
        }
      }}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <Grow in>
      <Paper className={classes.paperRoot} variant='outlined' width='1'>
        <Typography className={classes.typography} gutterBottom variant='h5'>
          BIM360
        </Typography>
        <BIM360 />
        &nbsp;
        <Typography className={classes.typography} variant='h5' gutterBottom>
          Default
        </Typography>
        <TreeView
          className={classes.tree}
          // TODO: Why doesnt the classses.tree work? It (the padding) is being overwritten by .MuiTreeView-root.
          style={{ padding: '8px 24px' }}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {isLoading ? <Loader /> : tree.map((item) => renderTree(item))}
        </TreeView>
      </Paper>
    </Grow>
  );
};

export default FileTree;
