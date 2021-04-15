/* global Autodesk, THREE */
const initializeViewer = async (urn, token) => {
  // const urn = props.location.state.urn;
  console.log(token);
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwdGFpd2FuX2J1Y2tldC9ydnRfc2FtcGxlX3Byb2plY3QucnZ0'; // Autodesk sample house
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwdGFpd2FuX2J1Y2tldC9ITkNCX1NFTV9DTEFTSF9SRVBPUlRfMTJGTC5ud2Q='; //huanan
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6d3NwdGFpd2FuX2J1Y2tldC9OVFVfQklNX2NsYXNzX2J1aWxkaW5nLnJ2dA=='; //ntu building
  // const token = props.auth.access_token;

  const viewerOptions = {
    accessToken: token?.access_token,
    env: 'MD20ProdUS',
    api: 'D3S',
  };

  var viewerContainer = document.getElementById('viewerContainer');
  var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer, {});

  Autodesk.Viewing.Initializer(viewerOptions, () => {
    viewer.start();
    Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
      var defaultModel = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, defaultModel);
    });
    viewer.loadExtension('Autodesk.DocumentBrowser');
  });
};

export default initializeViewer;
