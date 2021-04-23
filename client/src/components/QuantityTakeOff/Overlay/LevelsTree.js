import React, { useState } from 'react';
import BasicTree from './BasicTree.js';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.Mui-selected > .MuiTreeItem-content': {
      color: '#00bfff',
    },
  },
  itemLabel: {
    '&:hover': {
      backgroundColor: '#808080',
    },
  },
  categoryLabel: {
    '&:hover': {
      backgroundColor: '#808080',
    },
  },
  iconContainer: {
    marginLeft: '10px',
    marginRight: '0px',
  },
}));

const LevelsTree = (props) => {
  const styles = useStyles();

  const [selected, setSelected] = useState('');

  function createLabel(node) {
    return (
      <React.Fragment>
        <Typography component={'div'} noWrap={true}>
          {node.name}
        </Typography>
      </React.Fragment>
    );
  }

  const onMouseOver = () => {};
  const onMouseOut = () => {};
  const onIconClick = () => {};

  const onLabelClick = (event, node) => {
    console.log(node);
    const loadedExtensions = window.NOP_VIEWER.loadedExtensions['Autodesk.AEC.LevelsExtension'];
    loadedExtensions.aecModelData.levels.forEach((level, index) => {
      if (node.guid === level.guid) {
        loadedExtensions.floorSelector.selectFloor(index, true);

        if (index === selected) {
          loadedExtensions.floorSelector.selectFloor();
        }
        setSelected(index);
      }
    });
  };

  return (
    <BasicTree
      expanded={props.expandNodeId}
      selectedNodeId={props.selectedNode}
      onLabelRequest={createLabel}
      data={props.data}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onIconClick={onIconClick}
      onLabelClick={onLabelClick}
      classes={styles}
    />
  );
};

export default LevelsTree;
