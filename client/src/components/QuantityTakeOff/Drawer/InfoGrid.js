import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';

const InfoGrid = ({ elements }) => {
  // console.log(elements);
  const [dataGridCols, setDataGridCols] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  useEffect(() => {
    // add a new column everytime a new element is selected
    let newColumns = [{ field: 'parameter', headerName: 'ID', width: 110, sortable: false }];
    let rowElement = { id: 0, parameter: 'Name' };
    let newRows = [];
    let propertyCache = [];
    let propertyRow = [];
    propertyRow.push(rowElement);
    elements.forEach((element) => {
      console.log(element);
      newColumns.push({
        field: element.id,
        headerName: element.id,
        width: 150,
        sortable: false,
      });
      rowElement[element.id] = element.name;
      console.log(rowElement);
      newColumns.slice(0, -1).forEach((col) => {
        //each col has a name, which will be one row

        // now add the properties (1 row = 1 property)
        element.properties.forEach((property) => {
          if (!propertyCache.includes(property.displayname)) {
            console.log('adding new property');
            propertyCache.push(property.displayname);
            // console.log(propertyCache.indexOf(property.displayname));
            propertyRow.push({
              id: propertyCache.indexOf(property.displayname) + 1,
              parameter: property.displayname,
              [element.id]: property.displayValue,
            });
          } else {
            console.log('property already exists!');

            let tempval = propertyRow.findIndex(
              (o) => o.id === propertyCache.indexOf(property.displayname) + 1
            );
            propertyRow[tempval][element.id] = property.displayValue;
          }
        });
        console.log(propertyRow);
        // newRows = propertyRow;
      });
    });

    console.log(newColumns);
    console.log(propertyRow);

    setDataGridCols(newColumns);
    setDataGridRows(propertyRow);
    // console.log(rows, columns);
  }, [elements]);

  return (
    <>
      <div>
        You have selected: {elements[0].name} [{elements[0].id}]
      </div>
      &nbsp;
      <div style={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={dataGridRows}
          columns={dataGridCols}
          autoPageSize={true}
          checkboxSelection={false}
          disableColumnMenu={true}
          disableColumnSelector={true}
          disableSelectionOnClick={true}
          hideFooter={true}
          rowHeight={35}
          headerHeight={42}
        />
      </div>
    </>
  );
};

export default InfoGrid;
