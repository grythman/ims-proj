import React, { useState } from 'react';
import { submitReport } from '../../services/api';

const SubmitReportForm = () => {
  const [reportData, setReportData] = useState({ title: '', content: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReport(reportData);
      setStatus('Report submitted successfully');
    } catch (err) {
      setStatus('Failed to submit report');
    }
  };

  return (
    <div className="submit-report-form">
      <h2>Submit Report</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Report Title" onChange={handleChange} required />
        <textarea name="content" placeholder="Report Content" onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
      {status && <div className="status">{status}</div>}
    </div>
  );
};

export default SubmitReportForm; 