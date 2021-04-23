import React, { useState, useEffect, useContext } from 'react';
import { SelectedFileContext, GoogleUrnContext } from './Context';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import axios from 'axios';

import Viewer from './google-viewer';
import Loader from '../Utils/Loader';
const SERVER_URL = process.env.REACT_APP_API_ROUTE;
// const SERVER_URL = 'https://my-forge-server.herokuapp.com';
// const SERVER_URL = 'http://localhost:9001';
const FileInfo = () => {
  const { selectedFile } = useContext(SelectedFileContext);
  const { setGoogleUrn } = useContext(GoogleUrnContext);
  const [supportedFormats, setSupportedFormats] = useState([]);
  const [fileFormatSupported, setFileFormatSupported] = useState(false);
  const [viewerUrn, setViewerUrn] = useState(null);
  const [modelReadyToView, setModelReadyToView] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  useEffect(() => {
    const getSupportedFormats = async () => {
      setIsLoading(true);
      const result = await axios.get(`${SERVER_URL}/api/forge/supportedFormats`);

      setSupportedFormats(result.data);
    };

    getSupportedFormats();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // do all the checks for the file here.
    // triggered whenever a file is selected

    setViewerUrn(null);
    setFileFormatSupported(false);
    setModelReadyToView(false);
    const isFileSupported = () => {
      if (supportedFormats.includes(selectedFile.fileExtension)) {
        setFileFormatSupported((current) => !current);
        isTranslated();
      }
    };

    if (selectedFile) {
      isFileSupported();
    }
  }, [selectedFile]);

  // TO DO: figure out how to turn on the translation/open buttons appropriately.
  // No OPEN IF not translated
  // OPEN if translated
  // know if translated from manifest

  const sendToTranslation = async () => {
    setViewerUrn(null);

    try {
      const result = await axios(`${SERVER_URL}/api/google/sendToTranslation`, {
        method: 'post',
        withCredentials: true,
        data: {
          googlefile: `${selectedFile.id}`,
        },
      });
      console.log(result.data.urn);
      if (result.data.urn) {
        // setViewerUrn(result.data.urn);
        setGoogleUrn(result.data.urn);
      }
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const buttonSelection = () => {
    if (!fileFormatSupported) {
      return true;
    } else {
      return false;
    }
  };

  const isTranslated = async () => {
    setIsTranslationLoading(true);
    try {
      const result = await axios(`${SERVER_URL}/api/google/isTranslated`, {
        method: 'post',
        withCredentials: true,
        data: {
          googlefile: selectedFile.id,
        },
      });
      if (result.data.status === 200) {
        // translation completed OR currently translating. Can open.
        setModelReadyToView(true);
      }
      console.log(result.data);

      setIsTranslationLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadAndTranslate = async () => {
    console.log(selectedFile);
    try {
      const result = await axios(`${SERVER_URL}/api/google/uploadAndTranslate`, {
        method: 'post',
        withCredentials: true,
        data: {
          googlefile: selectedFile.id,
        },
      });
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {selectedFile ? (
        !isLoading ? (
          <>
            <div>File name: {selectedFile.name}</div>
            <div>File extension:{selectedFile.fileExtension}</div>
            <div>Version: {selectedFile.version}</div>
            {!viewerUrn ? (
              !isTranslationLoading ? (
                <Grid>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={modelReadyToView || buttonSelection()}
                    size='small'
                    onClick={() => {
                      // re implement the onclick
                      console.log('Translation clicked!');
                      uploadAndTranslate();
                    }}
                  >
                    Translate
                  </Button>
                  &nbsp;
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    disabled={!modelReadyToView}
                    onClick={() => {
                      console.log('Open clicked!');
                      sendToTranslation();
                    }}
                  >
                    Open
                  </Button>
                </Grid>
              ) : (
                <Loader />
              )
            ) : (
              <Button
                variant='contained'
                color='primary'
                disabled={!fileFormatSupported}
                onClick={() => {
                  console.log('Close clicked!');
                  setViewerUrn(null);
                }}
              >
                Close
              </Button>
            )}
            {/* {viewerUrn ? <Viewer urn={viewerUrn} /> : <div></div>} */}
          </>
        ) : (
          <Loader />
        )
      ) : (
        'Select a file'
      )}
    </div>
  );
};

export default FileInfo;
