import React from 'react';

const IssuesInfo = ({ selectedIssue }) => {
  return (
    <div>
      Issue selected!
      <div>{selectedIssue._id}</div>
      <div>{selectedIssue.title}</div>
      <div>{selectedIssue.description}</div>
      <div>{selectedIssue.creator}</div>
    </div>
  );
};

export default IssuesInfo;
