/* global Autodesk */
import { useEffect, useContext } from 'react';
import initializeViewer from './viewer-helper';
import { UrnContext } from '../Context';
import QuantityExtension from '../Extensions/QuantityExtension';
import HandleSelection from '../Extensions/HandleSelection';
import { useSelector } from 'react-redux';

const Viewer = () => {
  const { urn } = useContext(UrnContext);

  const token = useSelector((state) => state?.forge?.forgeToken);

  useEffect(() => {
    // empty forgeViewer to avoid leak

    if (!urn) {
      // console.log('no urn!');
    } else {
      let viewer = window.NOP_VIEWER;
      if (!viewer) {
        initializeViewer(urn, token);
      } else {
        viewer.finish();
        viewer = null;
        Autodesk.Viewing.shutdown();
        initializeViewer(urn, token);
      }
    }
  }, [urn]);

  return (
    <>
      <div id='viewerContainer'></div>
      <QuantityExtension />
      {/* <HandleSelection /> */}
    </>
  );
};

export default Viewer;
