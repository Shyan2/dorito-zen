/*global Autodesk */
import React, { useState, useEffect, useContext } from 'react';
import initializeViewer from './google-viewer-helper';
import { useSelector } from 'react-redux';
import { GoogleUrnContext } from './Context';
import axios from 'axios';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const Viewer = () => {
  const { googleUrn } = useContext(GoogleUrnContext);

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
    if (!googleUrn) {
    } else {
      let viewer = window.NOP_VIEWER;
      if (!viewer) {
        initializeViewer(googleUrn, tempToken);
      } else {
        viewer.finish();
        viewer = null;
        Autodesk.Viewing.shutdown();
        initializeViewer(googleUrn, tempToken);
      }
    }
  }, [googleUrn, tempToken]);

  return (
    <>
      <div id='viewerContainer'></div>
    </>
  );
};

export default Viewer;
