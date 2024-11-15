import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const SubmitReportModal = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submit Report</DialogTitle>
      <DialogContent>
        {/* Add report submission form fields */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitReportModal; 