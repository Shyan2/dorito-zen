const dataVizExt = await viewer.loadExtension('Autodesk.DataVisualization', { useInternal: true });
const viewableType = Autodesk.DataVisualization.Core.ViewableType.SPRITE;
const spriteColor = new THREE.Color(0x00ff00);
const spriteIconUrl = '/like.png';
const style = new Autodesk.DataVisualization.Core.ViewableStyle(
  viewableType,
  spriteColor,
  spriteIconUrl
);
const viewableData = new Autodesk.DataVisualization.Core.ViewableData();
viewableData.spriteSize = 24; // Sprites as points of size 24 x 24 pixels
const viewable1 = new Autodesk.DataVisualization.Core.SpriteViewable(
  { x: 200, y: 300, z: 10 },
  style,
  394892
);
viewableData.addViewable(viewable1);
const viewable2 = new Autodesk.DataVisualization.Core.SpriteViewable(
  { x: 100, y: 10, z: 20 },
  style,
  394893
);
viewableData.addViewable(viewable2);
await viewableData.finish();
function onItemClick(event) {
  console.log(`User has selected sprite with dbId - ${event.dbId}`);
}
viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, onItemClick);
dataVizExt.addViewables(viewableData);
