import { useState, useContext } from 'react';
import { UrnContext } from '../Context';
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
import ClearIcon from '@material-ui/icons/Clear';
import Loader from '../../Utils/Loader';

const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const useStyles = makeStyles((theme) => ({
  tree: {
    // padding: theme.spacing(0.5, 0, 0, 0),
    flexGrow: 1,
  },
}));

const BIMTree = (props) => {
  const classes = useStyles();

  const [childNodes, setChildNodes] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setUrn } = useContext(UrnContext);

  const fetchChildNodes = async (nodeId) => {
    if (nodeId.substring(0, 8) === 'https://') {
      setIsLoading(true);
    }
    const result = await axios.get(`${SERVER_URL}/api/forge/listProjects`, {
      withCredentials: true,
      params: {
        id: nodeId,
      },
    });
    let tempTree = '';
    console.log(result);
    if (result.data.length > 0) {
      tempTree = result.data;
    } else {
      tempTree = [
        {
          id: 'empty',
          name: 'No Files',
          type: 'none',
          children: false,
        },
      ];
    }
    setIsLoading(false);
    return tempTree;
  };

  const handleChange = (event, nodes) => {
    const expandingNodes = nodes.filter((x) => !expanded.includes(x));
    setExpanded(nodes);
    console.log(nodes);
    if (expandingNodes[0]) {
      const childId = expandingNodes[0];
      fetchChildNodes(childId).then((result) => {
        setChildNodes(
          result.map((node) => {
            // use cases for icons here
            switch (node.type) {
              case 'bim360Hubs':
                return (
                  <BIMTree
                    key={node.id}
                    {...node}
                    collapseIcon={<ExpandMoreIcon />}
                    expandIcon={<ChevronRightIcon />}
                  />
                );
              case 'bim360projects':
                return (
                  <BIMTree
                    key={node.id}
                    {...node}
                    collapseIcon={<ExpandMoreIcon />}
                    expandIcon={<ChevronRightIcon />}
                  />
                );
              case 'items':
                return <BIMTree key={node.id} {...node} icon={<InsertDriveFileIcon />} />;
              case 'versions':
                return (
                  <BIMTree
                    key={node.id}
                    {...node}
                    icon={<WatchLaterIcon />}
                    // set the urn
                    handleOnClick={() => {
                      console.log(node.id);
                      setUrn(node.id);
                    }}
                  />
                );
              case 'folders':
                return (
                  <BIMTree
                    key={node.id}
                    {...node}
                    // icon={<FolderIcon />}
                    collapseIcon={<FolderOpenIcon />}
                    expandIcon={<FolderIcon />}
                  />
                );
              case 'unsupported':
                return (
                  <BIMTree
                    key={node.id}
                    {...node}
                    icon={<RemoveCircleIcon />}
                    disableSelection={true}
                  />
                );
              case 'none':
                return <BIMTree key={node.id} {...node} disable={true} icon={<ClearIcon />} />;
              default:
                return <BIMTree key={node.id} {...node} name='empty' />;
            }
          })
        );
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
        icon={props.icon}
        collapseIcon={props.collapseIcon}
        expandIcon={props.expandIcon}
        onLabelClick={props.handleOnClick}
      >
        {!isLoading ? childNodes || [<div key='stub' />] : <Loader />}
      </TreeItem>
    </TreeView>
  );
};

export default BIMTree;
