// CreateSubfolderModal.js

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import axios from "axios";
import { toast } from "sonner";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteConfirmationPopup from "../../../upload/DeleteConfirmationPopup";

const SubFolderModal = ({
  isOpen,
  onClose,
  onCreateSubfolder,
  folderId,
  fetchData,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);  
  const [subfolderName, setSubfolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setSubfolderName(e.target.value);
  };

  const handleAddSubFolder = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", subfolderName);
      formData.append("parent", folderId);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/folder/add/`,
        formData,
        {
          withCredentials: true,
        }
      );

      setInputValue("");
      setSubfolderName("");
      onClose();

      toast.success("Subfolder created successfully");

      fetchData();
    } catch (error) {
      console.error("Error creating subfolder:", error);
      console.log("Server response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleAddSubFolder();
    }, 2000);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      style={loading ? { minHeight: "150px" } : {}}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "150px",
          }}
        >
          <DialogActions className="mt-1 mr-4">
            <h1 className="text-center text-xl font-bold font-body">
              Creating folder
            </h1>
            <CircularProgress size={30} />
          </DialogActions>
        </div>
      ) : (
        <>
          <DialogTitle>Create Subfolder</DialogTitle>
          <DialogContent>
            <input
              id="tag"
              className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-cyan-700 focus:outline-none"
              placeholder="sub-folder name"
              value={subfolderName}
              onChange={(e) => handleInputChange(e)}
            />
          </DialogContent>
          <DialogActions className="mt-4">
            <button
              onClick={onClose}
              class="text-white bg-gray-500  focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
            >
              {" "}
              Cancel
            </button>
            <button
              onClick={handleCreateButtonClick}
              className="text-white focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
              style={{ backgroundColor: "#1ca1d8" }}
              disabled={loading}
            >
              Create
            </button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default SubFolderModal;
