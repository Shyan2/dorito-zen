/*global Autodesk*/
import ReactPanel from './ReactPanel';

class ReactPanelExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);

    options?.loader?.show(false);
    console.log('this:');
    console.log(this);
    this.panel = new ReactPanel(viewer, {
      id: 'react-panel-id',
      title: 'React Panel',
    });
  }
  load() {
    console.log('Viewing.Extension.ReactPanel loaded');

    this.panel.setVisible(true);

    return true;
  }

  static get ExtensionId() {
    return 'Viewing.Extension.ReactPanel';
  }

  unload() {
    console.log('Viewing.Extension.ReactPanel unloaded');

    return true;
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  ReactPanelExtension.ExtensionId,
  ReactPanelExtension
);

export default 'Viewing.Extension.ReactPanel';
