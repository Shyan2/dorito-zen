/* global Autodesk */
import { useEffect } from 'react';
import initializeViewer from './viewer-helper';
import { useSelector } from 'react-redux';
import DTExtension from './DTExtension';

const Viewer = () => {
  const urn =
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwLW1haW4tb2ZmaWNlLyVFNSU4RiVCMCVFNSU4QyU5NyVFOCVCQiU4QSVFNyVBQiU5OSVFOCVCRSVBOCVFNSU4NSVBQyVFNSVBRSVBNC5ydnQ';

  const token = useSelector((state) => state?.forge?.forgeToken);
  console.log('helo');
  useEffect(() => {
    // empty forgeViewer to avoid leak
    const urn =
      'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwLW1haW4tb2ZmaWNlLyVFNSU4RiVCMCVFNSU4QyU5NyVFOCVCQiU4QSVFNyVBQiU5OSVFOCVCRSVBOCVFNSU4NSVBQyVFNSVBRSVBNC5ydnQ';
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
      <div id='digitalTwinViewer'></div>
      <DTExtension />
      {/* <ReactPanelExtension /> */}
    </>
  );
};

export default Viewer;
