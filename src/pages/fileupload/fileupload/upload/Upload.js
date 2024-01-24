import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Folder from "../folder/Folder";
import Sidebar from "../../../Sidebar/Sidebar";
import Header from "../../../Header/header";
import { useNavigate } from "react-router-dom";
import Tag from "../Tag/Tag";
import { firestore } from "../../../firestore/firestore";
import { addDoc, collection, Timestamp } from "@firebase/firestore";
import { getStorage, ref as Storage, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'sonner'
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import CardActions from '@mui/material/CardActions';

const Upload = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [user, setUser] = useState({});
  const [owner, setOwner] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileref = useRef();
  const ref = collection(firestore, "file");
  
  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);
  
  const handleOwnerChange = (e) => {
    setOwner(e.target.value);
  };
  const handleFolderChange = (folderName) => {
    setSelectedFolder((prevFolder) =>
      prevFolder === folderName ? "" : folderName
    );
  };
  const handleTagSelection = (tag) => {
    setNewTag(tag);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = [
      'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'htm', 'html', 'msg', 'pdf', 'rtf', 'txt', 'wpd', 'xps', 
      'bmp', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 
      'pot', 'potx', 'pps', 'ppt', 'pptm', 'pptx', 
      'csv', 'xls', 'xlsm', 'xlsx'
    ];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Unsupported file type. Please upload a valid document.");
      setSelectedFile(null);
      setUploadedFileName("");
      return;
    }

    setSelectedFile(file);
    setUploadedFileName(file.name);
};

  const handleUpload = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting the upload

      if (!selectedFile) {
        console.error("No file selected for upload");
        return;
      }
      const uniqueFileName = `${Date.now()}_${selectedFile.name}`;
      const storage = getStorage();
      const storageRef = Storage(storage, `file/${uniqueFileName}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      const fileData = {
        fileName: selectedFile.name,
        downloadURL: downloadURL,
        timestamp: Timestamp.fromDate(new Date()),
      };
      const docRef = await addDoc(ref, fileData);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", selectedFolder);
      formData.append("new_tag", newTag);
      formData.append("download_url", downloadURL);
      formData.append('account', user.id)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/add/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        toast.success("File uploaded successfully");
        console.log("File uploaded successfully");
        console.log(response.data);
        setUploadedFileName("");
        navigate('/file-list')
      }
      console.log("File uploaded successfully");
      console.log("Firestore document ID:", docRef.id);
      console.log("Download URL:", downloadURL);
      setUploadedFileName("");
    } catch (error) {
      toast.error("Error uploading file");
      console.error("Error uploading file", error);
    }
    finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        setTags(response.data.tags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTags();
  }, []);
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
    setUploadedFileName(file.name);
  };
  return (
    <>
      
      <form style = {{flex:1}}>
      <div className="mx-auto max-w-5xl py-32 sm:py-48 lg:py-56 relative w-100 ml-30">
      {isLoading && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)", 
              backdropFilter: "blur(5px)", 
              zIndex: 9998,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
          <CardActions>
          <p className="text-cyan-800 mb-2">{uploadedFileName}</p>
          </CardActions>
            <LinearProgress style={{ width: "50vw" }} />
            <CardActions>
            <CircularProgress size={30}/>
            <p>Uploading file...</p>
              </CardActions>
          </div>
        </>
      )}          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="owner"
                className="block text-sm font-medium leading-6 text-sky-900"
              >
                Owner
              </label>
              <div className="mt-2">
                <select
                  id="owner"
                  value={owner}
                  onChange={handleOwnerChange}
                  style={{ color: "black" }}
                  className="border-2 border-gray-500 p-2 rounded-md w-full focus:border-cyan-700 focus:outline-none"
                  
                >
                  <option>
                    {user.first_name} {user.last_name}
                  </option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="folder"
                className="block text-sm font-medium leading-6 text-sky-900"
              >
                Folder
              </label>
              <div className="mt-1.5">
                <Folder onSelect={handleFolderChange} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="label"
                className="block text-sm font-medium leading-6 text-sky-900"
              >
              Label
              </label>
              <div className="mt-1.5">
                <Tag onSelect={handleTagSelection} />
              </div>
            </div>
          </div>
          {/* Centered document upload div */}
          <div className="flex items-center justify-center mt-2">
            <div className="mx-auto max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-8">
                <div
                  className="sm:col-span-2 mx-auto text-center"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <label
                    htmlFor="file-upload"
                    className="p-8 w-full  border-2 border-dashed border-gray-300 h-56 mx-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#9CA3AF"
                      className="w-16 h-16 mb-2 mx-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                    <span className="text-lg text-gray-600 font-semibold block">
                      Drag and drop document here to upload
                    </span>
                    <span className="text-gray-600 block">
                      Upload documents of up to 31 MB in PDF, DOC, DOCX, RTF,
                      PPT, PPTX, JPEG, PNG, or TXT
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2 text-center">
                  <div>
                    <p className="text-cyan-800 mb-2">{uploadedFileName}</p>
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#1CA1D8",
                      color: "white",
                      padding: "8px 20px",
                      borderRadius: "5px",
                    }}
                    onClick={handleUpload}
                    disabled={isLoading}
                  >
 
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default Upload;