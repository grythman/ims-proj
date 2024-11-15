import React from 'react';
import { Box, Typography, List } from '@mui/material';

const EvaluationsSection = ({ evaluations }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Evaluations
      </Typography>
      <List>
        {/* Add evaluation list items here */}
      </List>
    </Box>
  );
};

export default EvaluationsSection; 