import React, { useEffect, useState } from 'react';
import { getPreliminaryReport } from '../../services/api';

const PreliminaryReportCheck = ({ reportId }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getPreliminaryReport(reportId);
      setReport(data);
    };
    fetchReport();
  }, [reportId]);

  return (
    <div className="preliminary-report-check">
      <h2>Preliminary Report</h2>
      {report ? (
        <div>
          <p>{report.content}</p>
          <p>Status: {report.status}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PreliminaryReportCheck; 