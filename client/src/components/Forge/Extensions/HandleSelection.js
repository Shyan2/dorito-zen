/* global Autodesk */
import { useContext } from 'react';
import { QuantityContext } from '../Context';

const HandleSelection = () => {
  const { setQuantity } = useContext(QuantityContext);

  function HandleSelection(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
  }

  HandleSelection.prototype = Object.create(Autodesk.Viewing.Extension.prototype);

  HandleSelection.prototype.constructor = HandleSelection;

  HandleSelection.prototype.load = function () {
    return true;
  };

  HandleSelection.prototype.onToolbarCreated = function (toolbar) {
    var qt_btn = new Autodesk.Viewing.UI.Button('quantityExtensionIcon');
    qt_btn.onClick = (ev) => {
      let viewer = window.NOP_VIEWER;
      const selection = window.viewer.getSelection();
      viewer.clearSelection();

      if (selection.length > 0) {
        selection.forEach((dbId) => {
          viewer.getProperties(dbId, (props) => {
            console.log(props);
          });
        });
      }
    };
    qt_btn.addClass('modelSummaryExtensionIcon');
    qt_btn.setToolTip('QTO');

    // CLASH DETECTION
    // var cd_btn = new Autodesk.Viewing.UI.Button('clashExtensionIcon');

    // cd_btn.onClick = () => {
    //   console.log('Clash detection clicked!!');
    // };

    // cd_btn.addClass('clashExtensionIcon');
    // cd_btn.setToolTip('Clash Analysis');

    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('wsp-toolbar');
    this.subToolbar.addControl(qt_btn);
    // this.subToolbar.addControl(cd_btn);
    toolbar.addControl(this.subToolbar);
  };

  HandleSelection.prototype.unload = function () {
    if (this.subToolbar) {
      this.viewer.toolbar.removeControl(this.subToolbar);
      this.subToolbar = null;
    }
    return true;
  };

  Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelection', HandleSelection);

  return null;
};

export default HandleSelection;
