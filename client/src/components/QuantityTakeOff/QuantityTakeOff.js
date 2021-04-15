import React from 'react';
import Viewer from './Viewer';
import wspLogoPng from '../../assets/images/Asset 16.png';
// Version 111
// dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLkxvdXhtNzk0U3dDWGhrcXB1MEZKRVE_dmVyc2lvbj0xMTE

const QuantityTakeOff = () => {
  const onModelLoaded = async (viewer, data) => {
    // FOR AEC Model data
    let viewerDocument = viewer.model.getDocumentNode().getDocument();
    const aecModelData = await viewerDocument.downloadAecModelData();
    console.log(aecModelData);
    let levelsExt = null;
    if (aecModelData) {
      levelsExt = await viewer.loadExtension('Autodesk.AEC.LevelsExtension');
      await viewer.loadExtension('Autodesk.AEC.LevelsExtension');
    }

    if (levelsExt) {
      console.log(levelsExt.floorSelector);
      console.log(Object.getOwnPropertyNames(levelsExt.floorSelector));
      console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(levelsExt.floorSelector)));
      console.log(Object.getPrototypeOf(levelsExt.floorSelector));
      levelsExt.floorSelector.selectFloor(3, true);
    }
    // END AEC Model data
  };
  return (
    <>
      <div>
        <Viewer onModelLoaded={onModelLoaded} />
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
      </div>
    </>
  );
};

export default QuantityTakeOff;
