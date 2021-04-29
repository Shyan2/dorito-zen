import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { IssuesContext } from './Context';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 150 },
  {
    field: 'assignedTo',
    headerName: 'Assigned to',
    width: 150,
  },
  {
    field: 'selectedFile',
    headerName: 'Selected File',
    width: 150,
  },
  { field: 'description', headerName: 'Description', width: 250 },
  { field: 'comments', headerName: 'Comments', width: 130 },
  { field: 'view', headerName: 'View', width: 150 },
  { field: 'delete', headerName: 'Delete', width: 130 },
];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];
const IssueGrid = () => {
  const { issues } = useContext(IssuesContext);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let newRows = [];
    if (issues) {
      issues.forEach((issue) => {
        console.log(issue);
        newRows.push({
          id: issue._id,
          title: issue.title,
          assignedTo: issue.assignedTo,
          selectedFile: issue.selectedFile,
          description: issue.description,
          comments: issue.comments.length,
        });
      });
    }
    setRows(newRows);
  }, [issues]);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default IssueGrid;
