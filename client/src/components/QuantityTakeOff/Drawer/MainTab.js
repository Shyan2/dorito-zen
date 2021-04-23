import React, { useState, useEffect, useContext } from 'react';
import useStyles from './styles';
import Loader from '../../Utils/Loader';
import InfoGrid from './InfoGrid';
import PropertyModalGrid from './PropertyModalGrid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { SelectedElementsContext } from '../Context';

function getModalStyle() {
  const top = 10;
  const left = 50;

  return {
    top: `${top}%`,
    margin: 'auto',
  };
}

const MainTab = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [isLoading, setIsLoading] = useState(false);
  const [localElementList, setLocalElementList] = useState(false);
  const [isIsolated, setIsIsolated] = useState(false);
  const [properties, setProperties] = useState(null);
  const { selectedElements } = useContext(SelectedElementsContext);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    // console.log(selectedElements);

    const getProperties = () => {
      setLocalElementList([]);
      if (window.NOP_VIEWER && selectedElements.length > 0) {
        window.NOP_VIEWER.model.getBulkProperties(selectedElements, (null, true), (items) => {
          // console.log(items);
          let itemList = [];
          items.forEach((item) => {
            let newItem = {
              id: item.dbId,
              name: item.name,
            };
            let propertyArray = [];
            item.properties.forEach((property) => {
              if (property.displayName === 'Category') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue,
                });
              }

              if (property.displayName === '樓層') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue,
                });
              }

              if (property.displayName === '備註') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue,
                });
              }

              if (property.displayName === '類型名稱') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue,
                });
              }

              if (property.displayName === 'FireRating') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue,
                });
              }

              if (property.displayName === '周長') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue.toFixed(2) + ' ' + property.units,
                });
              }

              if (property.displayName === '面積') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue.toFixed(2) + ' ' + property.units,
                });
              }

              if (property.displayName === '體積') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue.toFixed(2) + ' ' + property.units,
                });
              }

              if (property.displayName === '厚度') {
                propertyArray.push({
                  displayname: property.displayName,
                  displayValue: property.displayValue.toFixed(2) + ' ' + property.units,
                });
              }
            });
            //end properties
            newItem.properties = propertyArray;
            itemList.push(newItem);
          });
          setLocalElementList(itemList);
        });
      }
    };
    getProperties();
    setIsLoading(false);
  }, [selectedElements]);

  useEffect(() => {
    // console.log(localElementList);
  }, [localElementList]);

  const isolateElements = () => {
    if (selectedElements) {
      console.log('isolating: ', selectedElements);
      window.NOP_VIEWER.isolate(selectedElements);
      setIsIsolated((prevState) => !prevState);
    } else {
      window.NOP_VIEWER.isolate(null);
      setIsIsolated((prevState) => !prevState);
    }
    console.log(isIsolated);
  };

  const viewAllProperties = () => {
    console.log('All properties clicked!');
    window.NOP_VIEWER.getProperties(selectedElements[0], (elementDetail) => {
      setProperties(elementDetail.properties);
    });
    handleOpen();
  };

  // create datagrid from JSON data
  const body = (
    <div style={modalStyle} className={classes.propertiesPaper}>
      <PropertyModalGrid properties={properties} />
    </div>
  );

  const disableAllProperties = () => {
    return selectedElements.length > 1;
  };
  const elementInfo = () => {
    if (localElementList.length > 0) {
      return (
        <>
          <div>
            <InfoGrid elements={localElementList} />
          </div>
          &nbsp;
          <div>
            <Button variant='outlined' onClick={() => isolateElements()}>
              Isolate
            </Button>
            &nbsp;
            <Button
              variant='outlined'
              onClick={() => viewAllProperties()}
              disabled={disableAllProperties()}
            >
              All Properties
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <div>
          No element selected.
          {isIsolated ? (
            <div>
              <Button variant='outlined' onClick={() => isolateElements()}>
                Reset Isolation
              </Button>
            </div>
          ) : null}
        </div>
      );
    }
  };

  return (
    <>
      <div>{isLoading ? <Loader /> : elementInfo()}</div>{' '}
      <Modal
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </>
  );
};

export default MainTab;
