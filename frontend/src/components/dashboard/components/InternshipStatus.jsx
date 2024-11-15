import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

const InternshipStatus = ({ status }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Internship Status
        </Typography>
        <Chip
          label={status}
          color={status === 'Active' ? 'success' : 'default'}
        />
      </CardContent>
    </Card>
  );
};

export default InternshipStatus; 