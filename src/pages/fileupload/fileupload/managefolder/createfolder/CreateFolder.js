import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateFolder({ isOpen, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [folderName, setFolderName] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  const createFolder = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", folderName);
      formData.append("account", user.id);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/folder/add/`,
        formData,
        {
          withCredentials: true,
        }
      );

      setInputValue("");
      setFolderName((prevFolderName) => [response.data, ...prevFolderName]);
      onClose();
      toast.success("Folder created successfully");
      // navigate("/upload");
      window.location.reload();
    } catch (error) {
      console.error("Error creating folder", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      createFolder();
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
        <CircularProgress size={30}/>
        </DialogActions>

        </div>
      ) : (
        <>
          <h1 className="text-center text-xl font-bold font-body mt-4">
            Create Folder
          </h1>
          <DialogContent>
            <label
              htmlFor="folderName"
              className="block text-lg mb-2 font-medium leading-6 text-sky-900"
            >
              Folder name
            </label>
            <input
              id="tag"
              className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-sky-700 focus:outline-none"
              placeholder="folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </DialogContent>

          <DialogActions className="mt-4 mr-4">
            <button
              type="submit"
              className="text-white bg-gray-500 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
              style={{ backgroundColor: "#1ca1d8" }}
              onClick={handleCreateButtonClick}
              disabled={loading}
            >
              Create
            </button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}