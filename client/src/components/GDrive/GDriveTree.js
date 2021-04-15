import { useState, useContext } from 'react';
import { SelectedFileContext } from './Context';
import axios from 'axios';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';

import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// const SERVER_URL = 'http://localhost:9001';
// const SERVER_URL = 'https://my-forge-server.herokuapp.com';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const useStyles = makeStyles((theme) => ({
  tree: {
    // padding: theme.spacing(0.5, 0, 0, 0),
    flexGrow: 1,
  },
}));

const GDriveTree = (props) => {
  const classes = useStyles();
  const [childNodes, setChildNodes] = useState(null);
  const [expanded, setExpanded] = useState([]);

  const { setSelectedFile } = useContext(SelectedFileContext);

  const fetchChildNodes = async (nodeId) => {
    console.log(nodeId);
    const result = await axios.get(`${SERVER_URL}/api/google/gdrive`, {
      withCredentials: true,
      params: {
        id: nodeId,
      },
    });
    let tempTree = result.data;
    return tempTree;
  };

  const handleChange = (event, nodes) => {
    console.log(nodes);
    const expandingNodes = nodes.filter((x) => !expanded.includes(x));
    setExpanded(nodes);
    if (expandingNodes[0]) {
      const childId = expandingNodes[0];
      fetchChildNodes(childId).then((result) => {
        if (result.statusCode !== 404) {
          setChildNodes(
            result.map((node) => {
              console.log(node);
              return (
                <GDriveTree
                  key={node.id}
                  {...node}
                  collapseIcon={<ExpandMoreIcon />}
                  expandIcon={<ChevronRightIcon />}
                  handleOnClick={() => {
                    console.log(node.id);
                    setSelectedFile(node);
                  }}
                />
              );
            })
          );
        }
      });
    }
  };

  return (
    <TreeView
      className={classes.tree}
      defaultCollapseIcon={<FolderOpenIcon />}
      defaultExpandIcon={<FolderIcon />}
      expanded={expanded}
      onNodeToggle={handleChange}
    >
      <TreeItem
        nodeId={props.id}
        label={props.name}
        icon={<img src={props.icon} alt={props.name} />}
        collapseIcon={props.collapseIcon}
        expandIcon={props.expandIcon}
        onLabelClick={props.handleOnClick}
      >
        {childNodes || [<div key='stub' />]}
      </TreeItem>
    </TreeView>
  );
};

export default GDriveTree;
