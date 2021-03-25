/* global Autodesk */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const AV = Autodesk.Viewing;

const Viewer = (props) => {
  const [urn, setUrn] = useState(
    'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwLW1haW4tb2ZmaWNlLyVFNSU4RiVCMCVFNSU4QyU5NyVFOCVCQiU4QSVFNyVBQiU5OSVFOCVCRSVBOCVFNSU4NSVBQyVFNSVBRSVBNC5ydnQ'
  );

  useEffect(() => {
    if (props?.urn) {
      setUrn(props.urn);
    }
  }, []);

  const token = useSelector((state) => state?.forge?.forgeToken);

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
      // accessToken: token.data.access_token,
      accessToken: token?.access_token,
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
      const defaultModel = viewerDocument.getRoot().getDefaultGeometry(true);
      viewer.loadDocumentNode(viewerDocument, defaultModel, {
        keepCurrentModels: true,
      });

      // since ghosting is heavy, turn off
      viewer.prefs.set('ghosting', false);
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
  }, []);

  return <div id='forbiddenViewer' ref={viewerDomRef}></div>;
};

export default Viewer;
Viewer.displayName = 'Viewer';
