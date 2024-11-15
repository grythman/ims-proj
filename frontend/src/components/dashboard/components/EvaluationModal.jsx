import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const EvaluationModal = ({ open, onClose, evaluation }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Evaluation Details</DialogTitle>
      <DialogContent>
        {/* Add evaluation details */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvaluationModal; 