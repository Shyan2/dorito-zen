/* global Autodesk */
import { useContext } from 'react';
import { QuantityContext } from '../Context';

const QuantityExtension = () => {
  const { setQuantity } = useContext(QuantityContext);

  function QuantityExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
  }

  QuantityExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);

  QuantityExtension.prototype.constructor = QuantityExtension;

  QuantityExtension.prototype.load = function () {
    return true;
  };

  QuantityExtension.prototype.onToolbarCreated = function (toolbar) {
    var viewer = this.viewer;

    var qt_btn = new Autodesk.Viewing.UI.Button('quantityExtensionIcon');
    qt_btn.onClick = () => {
      console.log(viewer.getIsolatedNodes());
      console.log('QTO clicked!');
      const getAllLeafComponents = (callback) => {
        viewer.getObjectTree(function (tree) {
          let leaves = [];
          tree.enumNodeChildren(
            tree.getRootId(),
            function (dbId) {
              if (tree.getChildCount(dbId) === 0) {
                leaves.push(dbId);
              }
            },
            true
          );
          callback(leaves);
        });
      };
      getAllLeafComponents((dbIds) => {
        // prevent OOM
        let reducedDbIds = dbIds.slice(0, 20000);

        //const filteredProps = ['PropertyNameA', 'PropertyNameB'];
        const filteredProps = [''];
        // console.log(viewer.model);
        viewer.model.getBulkProperties(reducedDbIds, (null, true), (items) => {
          // viewer.model.getBulkProperties(dbIds, filteredProps, (items) => {
          // console.log(items);
          // setQuantity(items);

          let itemList = [];
          items.forEach((item) => {
            let newItem = {
              dbId: item.dbId,
              name: item.name,
              externalId: item.externalId,
            };
            let propertyArray = [];
            item.properties.forEach((property) => {
              if (property.displayValue !== '') {
                propertyArray.push({
                  displayName: property.displayName,
                  displayValue: property.displayValue,
                  displayCategory: property.displayCategory,
                  attributeName: property.attributeName,
                });
              }
            });
            newItem.properties = propertyArray;
            itemList.push(newItem);
          });
          setQuantity(itemList);
        });
      });
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

  QuantityExtension.prototype.unload = function () {
    if (this.subToolbar) {
      this.viewer.toolbar.removeControl(this.subToolbar);
      this.subToolbar = null;
    }
    return true;
  };

  Autodesk.Viewing.theExtensionManager.registerExtension('QuantityExtension', QuantityExtension);

  return null;
};

export default QuantityExtension;
