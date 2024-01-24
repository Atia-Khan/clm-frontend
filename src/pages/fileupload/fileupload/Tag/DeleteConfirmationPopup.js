import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, tagId }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm(tagId);
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error deleting folder", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this Label?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={handleDelete} color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;