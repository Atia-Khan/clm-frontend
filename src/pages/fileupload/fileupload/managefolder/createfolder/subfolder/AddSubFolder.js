import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TextField, Box, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import SubfolderModal from "./SubFolderModal";
import Header from "../../../../../Header/header";
import Sidebar from "../../../../../Sidebar/Sidebar";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import UpdateConfirmationPopup from "./UpdateConfirmationPopup";
import Pagination from "../../../upload/Pagination";
import { toast } from 'sonner'
import CircularProgress from "@mui/material/CircularProgress";

const AddSubFolder = () => {
  const { folderId } = useParams();
  const location = useLocation();
  // console.log('Location object:', location);
  const params = new URLSearchParams(location.search);
  const folderName = params.get("folderName") || "Unknown Folder";
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [subfolders, setSubFolders] = useState([]);
  const [editSubFolderId, setEditSubFolderId] = useState(null);
  const [editedSubFolderName, setEditedSubFolderName] = useState("");
  const [files, setFiles] = useState([]);
  const [draggedFile, setDraggedFile] = useState(null);
  const [isSubfolderModalOpen, setIsSubfolderModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] =
    useState(false);
  const [currentSubfolderPage, setCurrentSubfolderPage] = useState(1);
  const [currentlyEditedSubFolderId, setCurrentlyEditedSubFolderId] =
    useState(null);
  const [deleteFolderId, setDeleteFolderId] = useState(null);

  const [currentFilePage, setCurrentFilePage] = useState(1);
  const itemsPerPage = 5;
  const FilePerPage = 5;

  const indexOfLastSubfolder = currentSubfolderPage * itemsPerPage;
  const indexOfFirstSubfolder = indexOfLastSubfolder - itemsPerPage;
  const currentSubfolders = subfolders.slice(
    indexOfFirstSubfolder,
    indexOfLastSubfolder
  );

  const indexOfLastFile = currentFilePage * FilePerPage;
  const indexOfFirstFile = indexOfLastFile - FilePerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const [fileTags, setFileTags] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoadingSubfolder, setIsLoadingSubfolder] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  const fetchData = async () => {
    try {
      const detailsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/details/${folderId}/`
      );
      const detailsData = detailsResponse.data;

      const fileResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/file/list/`
      );
      const fileData = fileResponse.data;

      const tagsMap = {};
      fileData.file_list.forEach((file) => {
        tagsMap[file.pk] = file.fields.tags;
      });

      setSubFolders(detailsData.folder_list);
      setIsLoadingSubfolder(false);

      setFiles(detailsData.file_list);
      setFileTags(tagsMap);
      setIsLoadingFiles(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    finally{
      setIsLoadingFiles(false);
      setIsLoadingSubfolder(false);

    }
  };

  useEffect(() => {
    if (folderId !== null) {
      fetchData();
    }
  }, [folderId]);

  const handleConfirmUpdate = () => {
    setIsUpdateConfirmationOpen(true);
  };
  const handleOpenSubfolderModal = () => {
    setIsSubfolderModalOpen(true);
  };

  const handleCloseSubfolderModal = () => {
    setIsSubfolderModalOpen(false);
  };
  const handleOpenDeleteConfirmation = (id) => {
    setDeleteFolderId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteFolderId(null);
    setIsDeleteConfirmationOpen(false);
  };
  const handleCreateSubfolder = (subfolder) => {
    setSubFolders((prevSubfolders) => [...prevSubfolders, subfolder]);
    setSuccessMessage("Subfolder created successfully");
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    setIsDeleteConfirmationOpen(true);
    console.log(`Deleting subfolder with ID:`, id);
    const endpoint = `${process.env.REACT_APP_API_URL}/details/${folderId}/delete/${id}/`; // Include the subfolder ID in the endpoint

    try {
      await axios.post(endpoint);

      setSubFolders((prevSubFolders) =>
        prevSubFolders.filter((subfolder) => subfolder.id !== id)
      );

      console.log("Subfolder deleted successfully");
    } catch (error) {
      console.error(`Error deleting subfolder`, error);
    }
  };

  const handleEdit = (id, name) => {
    setEditSubFolderId(id);
    setEditedSubFolderName(name);
    setCurrentlyEditedSubFolderId(id); // Add this line
  };
  const handleCancelEdit = () => {
    setEditSubFolderId(null);
    setEditedSubFolderName("");
  };
  const handleCloseUpdateConfirmation = () => {
    setIsUpdateConfirmationOpen(false);
  };
  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editedSubFolderName);
      await fetch(
        `${process.env.REACT_APP_API_URL}/details/${folderId}/edit/${id}/`,
        {
          method: "POST",
          body: formData,
        }
      );
      setSubFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === id ? { ...folder, name: editedSubFolderName } : folder
        )
      );
      setEditSubFolderId(null);
      setEditedSubFolderName("");
    } catch (error) {
      console.error("Error editing folder", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, file) => {
    console.log("Drag Start - File ID:", file.id);
    event.dataTransfer.setData("text/plain", file.id);
    setDraggedFile(file);
  };

  const handleDrop = async (event, subfolderId) => {
    event.preventDefault();
    const draggedFileId = event.dataTransfer.getData("text/plain");
    console.log(
      "Drop - Dragged File ID:",
      draggedFileId,
      "Subfolder ID:",
      subfolderId,
      "Folder ID:",
      folderId
    );
    if (draggedFileId && subfolderId) {
      try {
        const formData = new FormData();
        formData.append("folder_id", subfolderId);
        // formData.append('folder_id', folderId);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/file/update/${draggedFileId}/`,
          formData
        );

        console.log("File updated successfully", response.data);
        window.location.reload();
        toast.success("File updated successfully")

        setDraggedFile(null);
      } catch (error) {
        console.error("Error updating file", error);
      }
    }
  };
  const handleDeleteFile = async (fileId) => {
    try {
      const endpoint = `${process.env.REACT_APP_API_URL}/file/delete/${fileId}/`;
      await axios.post(endpoint);

      // Update local state
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));

      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };
  const renderFolderLink = (subfolder) => (
    <Link
      to={`/subfolder/${folderId}/${
        subfolder.id
      }?folderName=${encodeURIComponent(
        folderName
      )}&subfolderName=${encodeURIComponent(subfolder.name)}`}
      className="flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 mr-2 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>
      <span className="text-gray-900 dark:text-black text-lg">
        {subfolder.name}
      </span>
    </Link>
  );

  return (
    <>
      {/* <div>
        <Header/>
        <Sidebar/>
      </div> */}
      <div className="relative isolate overflow-hidden  py-16 sm:py-24 lg:py-32 w-100">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="w-full p-4 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  />
                </svg>{" "}
                <h5 className="text-2xl font-semibold  leading-none text-gray-900 dark:text-black font-body">
                  {`  ${folderName}`}
                </h5>
              </div>

              <button
                onClick={handleOpenSubfolderModal}
                type="submit"
                class="text-white focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
                style={{ backgroundColor: "#1ca1d8" }}
              >
                Create New Sub-Folder
              </button>
            </div>
            <Box sx={{ maxWidth: 1245 }}>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-base text-white uppercase bg-cyan-500 dark:bg-cyan-600 dark:text-white">
                    <tr>
                      <th scope="col" class="px-6 py-4">
                        Sub-Folders
                      </th>
                      <th scope="col" class="px-6 py-4 ">
                        <div className="flex items-center px-8 justify-end">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingSubfolder ? (
                      <tr>
                        <td colSpan="2">
                        <CircularProgress size={30} />
                        </td>
                      </tr>
                    ) : subfolders.length === 0 ? (
                      <tr>
                        <td colSpan="2">
                          <p className="px-4 py-2 text-gray-700 text-lg text-center	">
                            No subfolders found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentSubfolders.map((subfolder) => (
                        <tr
                          key={subfolder.id}
                          onDragOver={(event) => handleDragOver(event)}
                          onDrop={(event) => handleDrop(event, subfolder.id)}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, subfolder.id)}
                          className="group hover:bg-gray-100 dark:hover:bg-gray-100  border-b  dark:border-gray-300"
                        >
                          <td className="px-6 py-4  font-body text-gray-900 dark:text-black">
                            {editSubFolderId === subfolder.id ? (
                              <input
                                className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-cyan-700 focus:outline-none"
                                placeholder="folder Name"
                                value={editedSubFolderName}
                                onChange={(e) =>
                                  setEditedSubFolderName(e.target.value)
                                }
                              />
                            ) : (
                              <div className="flex items-center">
                                <h5 className="text-lg  leading-none text-gray-900 dark:text-black font-body">
                                  {renderFolderLink(subfolder)}
                                </h5>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end">
                              {editSubFolderId === subfolder.id ? (
                                <>
                                  <Tooltip title="update changes" arrow>
                                    <button
                                      onClick={() =>
                                        handleSaveEdit(subfolder.id)
                                      }
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <span className="sr-only px-6">
                                        Save Changes
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Cancel" arrow>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <span className="sr-only">
                                        Cancel button
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                </>
                              ) : (
                                <>
                                  <Tooltip title="Edit" arrow>
                                    <button
                                      onClick={() =>
                                        handleEdit(subfolder.id, subfolder.name)
                                      }
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <span className="sr-only">
                                        Edit button
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                        />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Delete" arrow>
                                    <button
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                      onClick={() =>
                                        handleOpenDeleteConfirmation(
                                          subfolder.id
                                        )
                                      }
                                    >
                                      <span className="sr-only">
                                        delete button
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="#FF0000"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          // fill="#FF0000"
                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Go to folder" arrow>
                                    <Link
                                      to={`/subfolder/${folderId}/${
                                        subfolder.id
                                      }?folderName=${encodeURIComponent(
                                        folderName
                                      )}&subfolderName=${encodeURIComponent(
                                        subfolder.name
                                      )}`}
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                    >
                                      <span className="sr-only">
                                        Go to folder
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                      </svg>
                                    </Link>
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Box>
            {subfolders.length >= 5 && (
              <div className="flex justify-center items-center mt-5 mb-5">
                <Pagination
                  currentPage={currentSubfolderPage}
                  totalPages={Math.ceil(subfolders.length / itemsPerPage)}
                  setCurrentPage={setCurrentSubfolderPage}
                />
              </div>
            )}
            <Box sx={{ maxWidth: 1245, marginTop: 4 }}>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-base text-white uppercase bg-cyan-500 dark:bg-cyan-600 dark:text-white">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Files
                      </th>
                      <th scope="col" className="px-6 py-4 ">
                        <div className="flex items-center px-8 justify-end">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingFiles ? (
                      <tr>
                        <td colSpan="2">
                        <CircularProgress size={30} />
                        </td>
                      </tr>
                    ) : files.length === 0 ? (
                      <tr>
                        <td colSpan="2">
                          <p className="px-4 py-2 text-gray-700 text-lg text-center	">
                            No files found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <tr
                          key={file.id}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, file)}
                          className="group hover:bg-gray-100 dark:hover:bg-gray-100 border-b dark:border-gray-300"
                        >
                          <td>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-500 ml-7 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                              >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                              />                              </svg>

                              <h5 className="px-2 py-4 text-lg leading-none text-gray-900 dark:text-black font-body">
                                {file.name}
                              </h5>
                              {fileTags[file.id] && (
                                <div className="flex flex-wrap">
                                  {fileTags[file.id].map((tag) => (
                                    <div
                                      key={tag.name}
                                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full mt-1 mr-1"
                                      style={{ backgroundColor: tag.color }}
                                    >
                                      {tag.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-16 py-4">
                            <div className="flex items-center justify-end">
                              <Tooltip title="Delete" arrow>
                                <button
                                  className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                  type="button"
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  <span className="sr-only">delete button</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#FF0000"
                                    className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Box>
            {files.length >= 5 && (
              <div className="flex justify-center items-center mt-5 mb-5">
                <Pagination
                  currentPage={currentFilePage}
                  totalPages={Math.ceil(files.length / itemsPerPage)}
                  setCurrentPage={setCurrentFilePage}
                />
              </div>
            )}

            <SubfolderModal
              isOpen={isSubfolderModalOpen}
              onClose={handleCloseSubfolderModal}
              onCreate={handleCreateSubfolder}
              folderId={folderId}
              fetchData={fetchData}
            />
          </div>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDelete}
        folderId={deleteFolderId}
      />
      <UpdateConfirmationPopup
        isOpen={isUpdateConfirmationOpen}
        onClose={() => setIsUpdateConfirmationOpen(false)}
        onConfirm={() => {
          handleSaveEdit(currentlyEditedSubFolderId); // Use currentlyEditedSubFolderId
          handleCloseUpdateConfirmation();
        }}
      />
    </>
  );
};
export default AddSubFolder;
