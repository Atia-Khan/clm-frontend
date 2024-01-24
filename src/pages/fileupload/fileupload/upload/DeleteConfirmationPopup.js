import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import { useState } from 'react';

const DeleteFileConfirmationPopup = ({ open, onClose, onConfirm, fileId }) => {
  const [loading, setLoading] = useState(false);

  const handleYesClick = async () => {
    try {
      setLoading(true);
      await onConfirm(fileId);
      // Simulate a 2-second delay before closing the dialog
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 5000);
    } catch (error) {
      console.error("Error deleting file", error);
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to remove this file?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={handleYesClick} color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFileConfirmationPopup;
