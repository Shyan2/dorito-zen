/*global Autodesk*/
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import wspLogoPng from '../../assets/images/Asset 16.png';

import Viewer from './Viewer';
import Overlay from './Overlay/Overlay';
import Drawer from './Drawer/Drawer';
import { LevelsContext, QuantityContext, SelectedElementsContext } from './Context';

// Version 111
// dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLkxvdXhtNzk0U3dDWGhrcXB1MEZKRVE_dmVyc2lvbj0xMTE

const QuantityTakeOff = () => {
  const [levels, setLevels] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);

  const levelsValue = useMemo(() => ({ levels, setLevels }), [levels, setLevels]);
  const quantityValue = useMemo(() => ({ quantity, setQuantity }), [quantity, setQuantity]);
  const selectedElementsValue = useMemo(() => ({ selectedElements, setSelectedElements }), [
    selectedElements,
    setSelectedElements,
  ]);

  const handleClickAway = (event) => {
    // setLevelsButtonAnchor(null);
    // setLevels()
    setSelectedElements([]);
  };

  const onModelLoaded = async (viewer, data) => {
    // FOR AEC Model data
    let viewerDocument = viewer.model.getDocumentNode().getDocument();
    const aecModelData = await viewerDocument.downloadAecModelData();
    console.log(aecModelData);
    let levelsExt = null;
    if (aecModelData) {
      levelsExt = await viewer.loadExtension('Autodesk.AEC.LevelsExtension', {
        doNotCreateUI: true,
      });
      await viewer.loadExtension('Autodesk.AEC.LevelsExtension');
      setLevels(aecModelData.levels);
    }

    viewer.loadExtension('QuantityExtension');

    const dataVizExt = await viewer.loadExtension('Autodesk.DataVisualization', {
      useInternal: true,
    });
    const DATAVIZEXTN = Autodesk.DataVisualization.Core;

    const onItemClick = async (event) => {
      // console.log(`User has selected - ${event}`);
      // console.log(event);
      if (event.dbId) {
        await viewer.toggleSelect(
          event.dbId,
          viewer.model,
          'Autodesk.Viewing.SelectionType.REGULAR'
        );
        setSelectedElements(viewer.getSelection());
      } else {
        setSelectedElements([]);
      }

      // console.log(viewer.getSelection());
    };

    const onClick = async (event) => {
      // console.log('click detected, selection_changed_event triggered');
      if (!event.dbIdArray.length > 0) {
        setSelectedElements([]);
      }
      // console.log(event);
    };

    viewer.addEventListener(DATAVIZEXTN.MOUSE_CLICK, onItemClick);
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onClick);

    // END AEC Model data
  };

  useEffect(() => {
    // console.log(quantity);
  }, [quantity]);

  return (
    <LevelsContext.Provider value={levelsValue}>
      <QuantityContext.Provider value={quantityValue}>
        <SelectedElementsContext.Provider value={selectedElementsValue}>
          <Container maxWidth={false} disableGutters>
            <Grid container>
              <Grid item lg={8} md={12}>
                <Viewer onModelLoaded={onModelLoaded} />

                {levels ? <Overlay /> : null}
                <img
                  className='logo'
                  src={wspLogoPng}
                  style={{
                    width: '5%',
                    bottom: '12px',
                    position: 'absolute',
                    zIndex: 2,
                    left: '75px',
                    opacity: 0.7,
                  }}
                ></img>
              </Grid>
              <Grid item lg={4} md={12}>
                <Drawer />
              </Grid>
            </Grid>
          </Container>
        </SelectedElementsContext.Provider>
      </QuantityContext.Provider>
    </LevelsContext.Provider>
  );
};

export default QuantityTakeOff;
