import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProfileCompletion = ({ completion }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Profile Completion
      </Typography>
      <LinearProgress variant="determinate" value={completion} />
      <Typography variant="caption" color="text.secondary">
        {completion}% Complete
      </Typography>
    </Box>
  );
};

export default ProfileCompletion; 