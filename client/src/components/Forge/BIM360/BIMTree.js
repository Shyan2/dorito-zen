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

const SERVER_URL = 'http://localhost:9001';
// const SERVER_URL = 'https://bimwip.herokuapp.com';

const useStyles = makeStyles((theme) => ({
  tree: {
    padding: theme.spacing(0.5, 0, 0, 0),
    flexGrow: 1,
  },
}));
const BIMTree = (props) => {
  const classes = useStyles();

  const [childNodes, setChildNodes] = useState(null);
  const [expanded, setExpanded] = useState([]);

  const { setUrn } = useContext(UrnContext);

  const fetchChildNodesTest = async (nodeId) => {
    const result = await axios.get(`${SERVER_URL}/api/forge/listProjects`, {
      withCredentials: true,
      params: {
        id: nodeId,
      },
    });
    let tempTree = result.data;
    return tempTree;
  };

  const handleChange = (event, nodes) => {
    const expandingNodes = nodes.filter((x) => !expanded.includes(x));
    setExpanded(nodes);
    if (expandingNodes[0]) {
      const childId = expandingNodes[0];
      fetchChildNodesTest(childId).then((result) => {
        if (result.statusCode !== 404) {
          setChildNodes(
            result.map((node) => {
              // use cases for icons here
              switch (node.type) {
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
                  return <BIMTree key={node.id} {...node} icon={<RemoveCircleIcon />} />;
                default:
                  return <BIMTree key={node.id} {...node} />;
              }
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
        icon={props.icon}
        collapseIcon={props.collapseIcon}
        expandIcon={props.expandIcon}
        onLabelClick={props.handleOnClick}
      >
        {childNodes || [<div key='stub' />]}
      </TreeItem>
    </TreeView>
  );
};

export default BIMTree;
