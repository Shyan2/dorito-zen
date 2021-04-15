/*global Autodesk */
import React, { useEffect, useContext } from 'react';
import initializeViewer from './google-viewer-helper';
import { useSelector } from 'react-redux';
import { GoogleUrnContext } from './Context';

const Viewer = () => {
  const { googleUrn } = useContext(GoogleUrnContext);

  const token = useSelector((state) => state?.forge?.forgeToken);

  useEffect(() => {
    if (!googleUrn) {
    } else {
      let viewer = window.NOP_VIEWER;
      if (!viewer) {
        initializeViewer(googleUrn, token);
      } else {
        viewer.finish();
        viewer = null;
        Autodesk.Viewing.shutdown();
        initializeViewer(googleUrn, token);
      }
    }
  }, [googleUrn]);

  return (
    <>
      <div id='viewerContainer'></div>
    </>
  );
};

export default Viewer;
