/* global Autodesk */
import { useState, useEffect, useContext } from 'react';
import initializeViewer from './viewer-helper';
import { UrnContext } from '../Context';
import QuantityExtension from '../Extensions/QuantityExtension';
import HandleSelection from '../Extensions/HandleSelection';
import { useSelector } from 'react-redux';
import axios from 'axios';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const Viewer = () => {
  const { urn } = useContext(UrnContext);

  const token = useSelector((state) => state?.forge?.forgeToken);
  const [tempToken, setTempToken] = useState(null);

  useEffect(() => {
    const getNewToken = async () => {
      const newToken = await axios.get(`${SERVER_URL}/api/forge/getToken`);
      console.log(newToken.data.access_token);
      setTempToken(newToken.data.access_token);
    };
    getNewToken();
  }, []);

  useEffect(() => {
    // empty forgeViewer to avoid leak

    if (!urn) {
      // console.log('no urn!');
    } else {
      let viewer = window.NOP_VIEWER;
      if (!viewer) {
        initializeViewer(urn, tempToken);
      } else {
        viewer.finish();
        viewer = null;
        Autodesk.Viewing.shutdown();
        initializeViewer(urn, tempToken);
      }
    }
  }, [urn, tempToken]);

  return (
    <>
      <div id='viewerContainer'></div>
      <QuantityExtension />
      {/* <HandleSelection /> */}
    </>
  );
};

export default Viewer;
