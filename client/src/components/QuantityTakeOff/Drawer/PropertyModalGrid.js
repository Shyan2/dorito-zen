import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';

const PropertyModalGrid = ({ properties }) => {
  const [dataGridCols, setDataGridCols] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  // grids are displayName, displayValue, etc...
  useEffect(() => {
    console.log(properties);
    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'displayName', headerName: 'Name', width: 200 },
      { field: 'displayValue', headerName: 'Value', width: 300 },
      { field: 'displayCategory', headerName: 'Category', width: 200 },
      { field: 'attributeName', headerName: 'Attribute', width: 200 },
      { field: 'hidden', headerName: 'Hidden', width: 100 },
      { field: 'type', headerName: 'Type', width: 85 },
      { field: 'units', headerName: 'Unit', width: 100 },
    ];

    const addRows = () => {
      const itemRows = [];
      properties.forEach((property, index) => {
        itemRows.push({
          id: index,
          displayName: property.displayName,
          displayValue: property.displayValue,
          displayCategory: property.displayCategory,
          attributeName: property.attributeName,
          hidden: property.hidden,
          type: property.type,
          units: property.units,
        });
      });

      setDataGridRows(itemRows);
    };
    if (properties) {
      addRows();
    }

    setDataGridCols(columns);
  }, [properties]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={dataGridRows}
        columns={dataGridCols}
        autoPageSize={true}
        checkboxSelection={true}
        showCellRightBorder={true}
        showColumnRightBorder={true}
        checkboxSelection={false}
        // disableColumnMenu={true}
        // disableColumnSelector={true}
        disableSelectionOnClick={true}
        rowHeight={35}
        headerHeight={42}
      />
    </div>
  );
};

export default PropertyModalGrid;
