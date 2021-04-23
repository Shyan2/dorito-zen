import React, { useState, useEffect, useContext } from 'react';
import { LevelsContext } from '../Context';
import usestyles from './styles';
import { Popper, IconButton, Typography } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import LayersIcon from '@material-ui/icons/Layers';
import LevelsTree from './LevelsTree';

const LevelSelector = () => {
  const classes = usestyles();
  const [levelsButtonAnchor, setLevelsButtonAnchor] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [showLevels, setShowLevels] = useState(false);
  const [expandNodeId, setExpandNodeId] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');

  const { levels, setLevels } = useContext(LevelsContext);

  const handleLevelsButtonClick = (event) => {
    setLevelsButtonAnchor(event.currentTarget);
    setShowLevels(true);
  };

  const handleClickAway = (event) => {
    // setLevelsButtonAnchor(null);
    // setLevels()
    setShowLevels(false);
  };

  // levels = [
  //   { id: 1, name: 'First Floor', children: {} },
  //   { id: 2, name: 'Second Floor', children: {} },
  //   { id: 3, name: 'Third Floor', children: {} },
  // ];
  useEffect(() => {
    // if (levels.length > 0) setShowLevels(true);
  }, []);
  return (
    <>
      {levels.length > 0 ? (
        <div>
          <IconButton
            id='levelsButton'
            className={classes.customHoverFocus}
            onClick={handleLevelsButtonClick}
            ref={levels.length > 0 ? setLevelsButtonAnchor : null}
          >
            <LayersIcon style={{ fill: 'inherit' }} />
          </IconButton>
          <Popper
            className={classes.popper}
            open={showLevels}
            placement='right-start'
            anchorEl={levelsButtonAnchor}
            disablePortal={false}
            modifiers={{
              flip: {
                enabled: true,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: 'scrollParent',
              },
              arrow: {
                enabled: true,
                element: arrowRef,
              },
            }}
          >
            <React.Fragment>
              {/* <span className={classes.arrow} ref={setArrowRef} /> */}
              <ClickAwayListener onClickAway={handleClickAway}>
                <Typography className={classes.typography} component='div'>
                  {levels.length > 0 ? (
                    <>
                      <LevelsTree
                        data={levels}
                        expandNodeId={expandNodeId}
                        selectedNode={selectedNodeId}
                      />
                    </>
                  ) : (
                    <span>No level data found in the model.</span>
                  )}
                </Typography>
              </ClickAwayListener>
            </React.Fragment>
          </Popper>
        </div>
      ) : null}
    </>
  );
};

export default LevelSelector;
