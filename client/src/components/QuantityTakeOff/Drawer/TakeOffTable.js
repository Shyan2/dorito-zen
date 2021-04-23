import { useState, useEffect } from 'react';
import useStyles from './styles';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import PropertyModalGrid from './PropertyModalGrid';
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 10;
  const left = 50;

  return {
    top: `${top}%`,
    margin: 'auto',
    // left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function QuantityTable({ data, filters }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [properties, setProperties] = useState(null);
  const [dataGridCols, setDataGridCols] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', width: 250 },
    ];

    setDataGridCols(columns);
    if (filters) {
      filters.forEach((filter) => {
        const newCol = {
          field: filter,
          headerName: filter,
          width: 200,
        };
        setDataGridCols((dataGridCols) => [...dataGridCols, newCol]);
      });
    }
    // properties in last col
    let properties = {
      field: 'properties',
      headerName: 'Properties',
      width: 250,
      renderCell: (params) => (
        <Button
          variant='contained'
          size='small'
          style={{ marginLeft: 16 }}
          onClick={() => {
            handleOpen();
            setProperties(params.value);
          }}
        >
          View
        </Button>
      ),
    };
    setDataGridCols((dataGridCols) => [...dataGridCols, properties]);
  }, [filters, data]);

  useEffect(() => {
    const addRows = () => {
      const itemRows = [];

      data.forEach((item) => {
        let returnValue = {
          id: item.dbId,
          name: item.name,
          properties: item.properties,
        };

        dataGridCols.slice(2, -1).forEach((col) => {
          // item.properties is an array of objects
          // Get displayValue from 1st displayName object match
          let propertyValue = item.properties.find((o) => o.displayName === col.field);
          if (propertyValue) {
            returnValue[col.field] = propertyValue.displayValue;
          }
        });

        itemRows.push(returnValue);
      });
      setDataGridRows(itemRows);
    };

    if (data) {
      addRows();
    }
  }, [filters, data, dataGridCols]);

  const body = (
    <div style={modalStyle} className={classes.propertiesPaper}>
      {/* <h2 id='simple-modal-title'>Properties</h2> */}
      {/* <pre>{JSON.stringify(properties, null, 2)}</pre> */}
      <PropertyModalGrid properties={properties} />
    </div>
  );

  return (
    <div>
      <div style={{ height: '60vh', width: '100%' }}>
        <DataGrid
          rows={dataGridRows}
          columns={dataGridCols}
          autoPageSize={true}
          checkboxSelection={true}
          showCellRightBorder={true}
          showColumnRightBorder={true}
          // onSelectionChange={(newSelection) => {
          //   setSelection(newSelection.rowIds);
          // }}
        />
      </div>

      <Modal
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </div>
  );
}
