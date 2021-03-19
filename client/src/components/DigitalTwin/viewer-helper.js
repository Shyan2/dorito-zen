/*global Autodesk*/
const initializeViewer = async (urn, token) => {
  const viewerOptions = {
    // accessToken: token.data.access_token,
    accessToken: token?.access_token,
    env: 'MD20ProdUS',
    api: 'D3S',
  };

  var viewerContainer = document.getElementById('digitalTwinViewer');
  var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer, {
    extensions: ['DTExtension'],
    //'Viewing.Extension.ReactPanel'],
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
