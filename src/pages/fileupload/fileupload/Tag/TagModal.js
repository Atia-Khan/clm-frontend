import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";
const TagModal = ({ isOpen, onClose }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#0EA5E9");
  const [tags, setTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleTagNameChange = (e) => {
    setTagName(e.target.value);
  };
  const handleTagColorChange = (e) => {
    setTagColor(e.target.value);
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
  const handleAddTag = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("tag_name", tagName);
      formData.append("tag_color", tagColor);
      formData.append('account', user.id)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/create_tag/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTagName("");
      setTagColor("");
      setSelectedColor(tagColor);
      setTags((prevTags) => [response.data, ...prevTags]);
      onClose();
      toast.success("Tag created successfully");
      // navigate('/upload')
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error adding tag:", error);
      console.log("Server response:", error.response?.data);
      // Show error toast here if needed
      toast.error("Error creating tag");
    }finally {
      setLoading(false);
    }
  };
  const handleCreateButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleAddTag();
    }, 2000);
  };
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/file/get_tags/`);
      console.log("Fetched tags:", response.data);
      setTags(response.data.tags || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };
  useEffect(() => {
    fetchTags();
  }, []);
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth
    style={loading ? { minHeight: "150px" } : {}}
    > {loading ? (
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
        Creating label
      </h1>
      <CircularProgress size={30}/>
      </DialogActions>
      </div>
    ) : (
      <>
      <h1 className="text-center text-xl font-bold  font-body mt-4">Create Label</h1>
      <DialogContent className="ml-6">
        <div className="flex items-center space-x-2 text-sm mt-4"  >
          <div
            style={{
              backgroundColor: tagColor,
              padding: "8px",
              borderRadius: "90px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="text-grey"
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {tagName || "Label preview"}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogContent className="ml-6">
        <label
          htmlFor="tagName"
          className="block text-lg mb-2 font-medium leading-6 text-sky-900"
        >
          Tag name
        </label>
        <input
          id="tagName"
          className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-sky-700 focus:outline-none"
          placeholder="Label name"
          value={tagName}
          onChange={(e) => handleTagNameChange(e)}
        />
      </DialogContent>
      <DialogContent className="ml-6">
        <label
          htmlFor="tagColor"
          className="block text-lg font-medium leading-6 mb-1 text-sky-900"
        >
         Change Label Color
        </label>
        <div className="flex items-center space-x-2">
          <div className="rounded inline-flex overflow-hidden">
            <input
              type="color"
              id="tagColor"
              className="w-4 h-4 appearance-none"
              style={{ padding: "0", margin: "0", border: "none" }}
              value={tagColor}
              onChange={(e) => handleTagColorChange(e)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="mt-4 mr-4">
        <button
          onClick={onClose}
          className="text-white bg-gray-500  focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
        >
          Cancel
        </button>
        <button
        onClick={handleCreateButtonClick}
        class="text-white focus:ring-4  focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
          style={{ backgroundColor: "#1CA1D8" }}           >
          Create
        </button>
      </DialogActions>
      </>
      )}
    </Dialog>
  );
};
export default TagModal;