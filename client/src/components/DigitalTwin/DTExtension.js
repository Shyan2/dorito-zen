/*global Autodesk*/
import { useState, useEffect } from 'react';
import DockingPanel from './DockingPanel';
import ReactPanel from './TestReactPanel/ReactPanel';

const DTExtension = () => {
  const [panelOn, setPanelOn] = useState(false);

  useEffect(() => {}, []);
  function DTExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
  }

  DTExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
  DTExtension.prototype.constructor = DTExtension;

  DTExtension.prototype.load = function () {
    return true;
  };

  DTExtension.prototype.onToolbarCreated = function (toolbar) {
    var dt_btn = new Autodesk.Viewing.UI.Button('cctvMarkupExtensionIcon');
    dt_btn.onClick = () => {
      console.log('Clicked me!');
      //setIsSignup((prevIsSignup) => !prevIsSignup);
      setPanelOn((prevPanelOn) => !prevPanelOn);
      // On click load DockingPanel
    };

    dt_btn.addClass('cctvMarkupExtensionIcon');
    dt_btn.setToolTip('Camera');

    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('wsp-toolbar');
    this.subToolbar.addControl(dt_btn);
    toolbar.addControl(this.subToolbar);
  };

  DTExtension.prototype.unload = function () {
    if (this.subToolbar) {
      this.viewer.toolbar.removeControl(this.subToolbar);
      this.subToolbar = null;
    }
    return true;
  };

  Autodesk.Viewing.theExtensionManager.registerExtension(
    'DTExtension',
    DTExtension
  );

  const viewer = window.NOP_VIEWER;
  if (viewer) {
    const newPanel = new ReactPanel(window.NOP_VIEWER, {
      id: 'react-panel-id',
      title: 'Video stream',
    });
    newPanel.setVisible(true);
  }
  return null;
  // return <div>{panelOn ? <DockingPanel /> : null}</div>;
};

export default DTExtension;
