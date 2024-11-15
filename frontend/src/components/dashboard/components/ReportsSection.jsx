import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ReportsSection = ({ onSubmitReport }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Reports
      </Typography>
      <Button variant="contained" onClick={onSubmitReport}>
        Submit Report
      </Button>
    </Box>
  );
};

export default ReportsSection; 