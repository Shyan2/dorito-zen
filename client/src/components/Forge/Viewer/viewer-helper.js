/* global Autodesk */
import axios from 'axios';

const initializeViewer = async (urn, token) => {
  // const token = await axios.get(
  //   'https://wsp-internal-forge.herokuapp.com/api/forge/oauth/token'
  // );
  //use 'https://bimwip.herokuapp.com
  console.log(token);
  const viewerOptions = {
    // accessToken: token.data.access_token,
    accessToken: token?.access_token,
    env: 'MD20ProdUS',
    api: 'D3S',
  };

  var viewerContainer = document.getElementById('viewerContainer');
  var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer, {
    extensions: ['QuantityExtension', 'Autodesk.DocumentBrowser'],
  });

  Autodesk.Viewing.Initializer(viewerOptions, () => {
    viewer.start();
    Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
      var defaultModel = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, defaultModel);
      doc.downloadAecModelData();
    });
  });
};

export default initializeViewer;
