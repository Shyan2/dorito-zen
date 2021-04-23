import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TreeItem from '@material-ui/lab/TreeItem';

function BasicTree(props) {
  function onEvent(handlerName, data) {
    return (event) => {
      if (props[handlerName]) {
        props[handlerName](event, data);
      }
    };
  }

  const classes = props.classes;

  function getChildNodes(node) {
    if (Array.isArray(node.children)) {
      console.log('has children!', node.children);
      return node.children;
    }

    return [];
  }

  function getPath(tree, goal) {
    // console.log(tree);
    function helper(tree, goal) {
      if (tree.guid == goal) return [tree.guid];

      for (let i = 0; i < tree?.children?.length; i++) {
        let subpath = helper(tree?.children[i], goal);
        if (subpath) {
          return [tree.guid].concat(subpath);
        }
      }
    }

    for (let index = 0; index < tree.length; index++) {
      const path = helper(tree[index], goal);
      if (path) return path;
    }

    return [];
  }

  const renderTree = (node) => (
    <TreeItem
      key={node.guid}
      nodeId={node?.guid.toString()}
      onMouseOver={onEvent('onMouseOver', node)}
      onMouseOut={onEvent('onMouseOut', node)}
      onLabelClick={onEvent('onLabelClick', node)}
      onIconClick={onEvent('onIconClick', node)}
      label={props.onLabelRequest(node)}
    >
      {
        // Render only child nodes of the expanded node.
        getChildNodes(node).map((child) => renderTree(child))
      }
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      expanded={getPath(props.data, props.expanded)}
      selected={props.selectedNodeId}
    >
      {props.data.map((device) => renderTree(device))}
    </TreeView>
  );
}

export default BasicTree;
