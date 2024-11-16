import React from 'react';

const ReportList = ({ reports }) => {
  return (
    <div className="report-list">
      <h2>Reports</h2>
      <ul>
        {reports.map(report => (
          <li key={report.id}>
            {report.title} - {report.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList; 