/*global Autodesk*/

const DockingPanel = () => {
  function MyAwesomePanel(viewer, container, id, title, options) {
    this.viewer = window.NOP_VIEWER;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = '10px';
    this.container.style.left = 'auto';
    this.container.style.width = '350px';
    this.container.style.height = '500px';

    // let viewer = window.NOP_VIEWER;
    let panelDiv = document.createElement('div');
    let panelChild = viewer.container.appendChild(panelDiv);

    panelChild.classList.add('docking-panel-container-solid-color-a');
    panelChild.style.top = '10px';
    panelChild.style.left = 'auto';
    panelChild.style.width = '350px';
    panelChild.style.height = '500px';
    // panelChild.style.resize = 'auto';

    // this is where we should place the content of our panel
    var div = document.createElement('div');
    div.style.margin = '10px';
    div.style.width = '100% + 50px';
    div.style.height = '100% + 50px';
    //"height: 300px; width: 100%"></div>
    div.id = 'chartContainer';
    panelChild.appendChild(div);
  }

  MyAwesomePanel.prototype = Object.create(
    Autodesk.Viewing.UI.DockingPanel.prototype
  );
  MyAwesomePanel.prototype.constructor = MyAwesomePanel;

  return null;
};

export default DockingPanel;
