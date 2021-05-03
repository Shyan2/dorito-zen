import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { IssuesContext } from './Context';

const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
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

const IssueGrid = () => {
  const { issuesList } = useContext(IssuesContext);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let newRows = [];
    if (issuesList) {
      issuesList.forEach((issue) => {
        console.log(issue);
        newRows.push({
          id: issue._id,
          title: issue?.title,
          assignedTo: issue?.assignedTo,
          selectedFile: issue?.selectedFile,
          description: issue?.description,
          comments: issue?.comments?.length,
        });
      });
    }
    setRows(newRows);
  }, [issuesList]);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default IssueGrid;
