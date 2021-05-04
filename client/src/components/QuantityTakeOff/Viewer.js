/* global Autodesk */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import QuantityExtension from './Extensions/QuantityExtension';
import axios from 'axios';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

const AV = Autodesk.Viewing;

const Viewer = (props) => {
  const [urn, setUrn] = useState(
    'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLkxvdXhtNzk0U3dDWGhrcXB1MEZKRVE_dmVyc2lvbj0xMTE'
  );

  const [tempToken, setTempToken] = useState(null);

  useEffect(() => {
    if (props?.urn) {
      setUrn(props.urn);
    }

    const getNewToken = async () => {
      const newToken = await axios.get(`${SERVER_URL}/api/forge/getToken`);
      console.log(newToken.data.access_token);
      setTempToken(newToken.data.access_token);
    };
    getNewToken();
  }, []);
  const token = useSelector((state) => state?.forge?.forgeToken);
  console.log(token);

  const viewerRef = useRef(null);
  const viewerDomRef = useRef(null);

  const onModelLoaded = (event) => {
    const viewer = viewerRef.current;

    viewer.removeEventListener(AV.GEOMETRY_LOADED_EVENT, onModelLoaded);

    if (props?.onModelLoaded) {
      props.onModelLoaded(viewer, event);
    }
  };

  // const initializeViewer = async (urn, token) => {
  const initializeViewer = () => {
    const viewerOptions = {
      // accessToken: token?.access_token,
      accessToken: tempToken,
      env: 'MD20ProdUS',
      api: 'D3S',
    };

    AV.Initializer(viewerOptions, async () => {
      const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDomRef.current);
      viewerRef.current = viewer;

      const startedCode = viewer.start(undefined, undefined, undefined, undefined, viewerOptions);
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }

      viewer.addEventListener(AV.GEOMETRY_LOADED_EVENT, onModelLoaded, {
        once: true,
      });

      loadModel(viewer, urn);

      if (props?.onViewerInitialized) {
        props.onViewerInitialized(viewer);
      }
    });
  };

  const loadModel = (viewer, documentId) => {
    const onDocumentLoadSuccess = (viewerDocument) => {
      // viewerDocument is an instance of Autodesk.Viewing.Document
      // const defaultModel = viewerDocument.getRoot().getDefaultGeometry(true); // does not load links
      const defaultModel = viewerDocument.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(viewerDocument, defaultModel, {
        keepCurrentModels: true,
      });

      // since ghosting is heavy, turn off
      viewer.prefs.set('ghosting', false);
      // viewer.prefs.set('ghosting', true);
    };

    const onDocumentLoadFailure = () => {
      console.error('Failed fetching Forge manifest');
    };

    if (documentId) {
      AV.Document.load(`urn:${documentId}`, onDocumentLoadSuccess, onDocumentLoadFailure);
    }
  };

  useEffect(() => {
    initializeViewer();

    return function cleanUp() {
      if (viewerRef.current) {
        viewerRef.current.finish();
      }
    };
  }, [tempToken]);

  return (
    <>
      <div id='quantityViewer' ref={viewerDomRef}></div> <QuantityExtension />
    </>
  );
};

export default Viewer;
Viewer.displayName = 'Viewer';
