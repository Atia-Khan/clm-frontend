import React, { useState, useEffect } from "react";
import { TextField, Typography, Tooltip, Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../Sidebar/Sidebar";
import Header from "../../../Header/header";
import TagModal from "./TagModal";
import Pagination from "../upload/Pagination";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import UpdateConfirmationPopup from "./UpdateConfirmationPopup";
import CircularProgress from "@mui/material/CircularProgress";

const CreateEditTag = () => {
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editTagId, setEditTagId] = useState(null);
  const [editedTagName, setEditedTagName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [editedTagColor, setEditedTagColor] = useState("");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] = useState(false);
  const [updateTagId, setUpdateTagId] = useState(null);
  const [user, setUser] = useState({});
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const [currentFilePage, setCurrentFilePage] = useState(1);
  const FilePerPage = 5;

  const indexOfLastTag = currentFilePage * FilePerPage;
  const indexOfFirstTag = indexOfLastTag - FilePerPage;
  
  const displayedTags = tags.slice(indexOfFirstTag, indexOfLastTag);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
  const handleEdit = (id, name, color) => {
    setEditTagId(id);
    setEditedTagName(name);
    const selectedTag = tags.find((tag) => tag.id === id);
    if (selectedTag) {
      setEditedTagColor(selectedTag.color);
    }
    setIsEditMode(true);
    setUpdateTagId(id);
  };
  
  
  const handleCancelEdit = () => {
    setEditTagId(null);
    setEditedTagName("");
    setIsEditMode(false);
  };
  
  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editedTagName);
      formData.append(
        "color",
        editedTagColor || tags.find((tag) => tag.id === id)?.color || ""
      );
  
      await fetch(`${process.env.REACT_APP_API_URL}/file/edit_tag/${id}/`, {
        method: "POST",
        body: formData,
      });
  
      setTags((prevTags) =>
        prevTags.map((tag) =>
          tag.id === id
            ? {
                ...tag,
                name: editedTagName,
                color: editedTagColor || tag.color,
              }
            : tag
        )
      );
  
      // Do not reload immediately here
    } catch (error) {
      console.error("Error editing tag", error);
    }
  };
  const handleConfirmUpdate = () => {
    setIsUpdateConfirmationOpen(true);
    // window.location.reload();
  };
  const handleDelete = (id) => {
    setDeleteTagId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/file/delete_tag/${id}/`, {
        method: "DELETE",
      });
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error("Error deleting tag", error);
    }
  };

  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        console.log("Fetched tags:", response.data);

        const tagsArray = response.data.tags || [];
        const userId = user.id;

        const  filteredTags = tagsArray.filter(tag => tag.account === userId)
        const reversedTags = filteredTags.slice().reverse();

        setTags(reversedTags);
        setIsLoadingTags(false);

      } catch (error) {
        console.error("Error fetching tags", error);
      }
      finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, [user]);

  return (
    <>
      {/* <div>
        <Header />
        <Sidebar />
      </div> */}
      <div className="relative isolate overflow-hidden  py-16 sm:py-24 lg:py-32 mt-20 w-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="w-full p-4 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black font-body">
                Manage Labels
                <p className="mt-0 text-sm leading-8 text-gray-500 font-body">
                  Apply label to documents, sign requests, or templates to
                  organize your documents.
                </p>
              </h5>
              <button
                type="submit"
                class="text-white focus:ring-4  focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
                style={{ backgroundColor: "#1ca1d8" }}
                onClick={handleOpenModal}
              >
                Create New Label
              </button>
            </div>
            <Box sx={{ maxWidth: 1245 }}>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-base text-white uppercase bg-cyan-500 dark:bg-cyan-600 dark:text-white">
                    <tr>
                      <th scope="col" className="px-12 py-4">
                        Labels
                      </th>
                      <th scope="col" className="px-6 py-4 ">
                        <div className="flex items-center px-8 justify-end">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingTags ? (
                      <tr>
                        <td colSpan="2">
                        <CircularProgress size={30} />
                        </td>
                      </tr>
                    ) : displayedTags.length === 0 ? (
                      <tr>
                        <td colSpan="2">
                          <p className="px-4 py-2 text-gray-700 text-lg text-center	">
                            No labels found
                          </p>
                        </td>
                      </tr>
                    ) : (
                    displayedTags.map((tag) => (
                      <tr
                        key={tag.id}
                        className="group hover:bg-gray-100 dark:hover:bg-gray-100  border-b  dark:border-gray-300"
                      >
                        <td className="px-6 py-4 font-semibold font-body text-gray-900 dark:text-black">
                          {tag.id === editTagId ? (
                            <>
                              <input
                                id="tag"
                                className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-cyan-700 focus:outline-none"
                                placeholder="Tag Name"
                                value={editedTagName}
                                onChange={(e) =>
                                  setEditedTagName(e.target.value)
                                }
                              />

                              <div className=" p-2">
                                <Tooltip title="color change" arrow>
                                  <div className="rounded inline-flex overflow-hidden ">
                                    <input
                                      type="color"
                                      id="nativeColorPicker2"
                                      className="w-4 h-4 appearance-none"
                                      style={{
                                        padding: "0",
                                        margin: "0",
                                        border: "none",
                                      }}
                                      value={editedTagColor}
                                      onChange={(e) =>
                                        setEditedTagColor(e.target.value)
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                backgroundColor:
                                  tag.id === editTagId
                                    ? editedTagColor
                                    : tag.color,

                                padding: "8px",
                                borderRadius: "90px",
                                width: "100px",
                                textAlign: "center",
                              }}
                            >
                              {tag.name}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            {tag.id === editTagId ? (
                              <>
                                <Tooltip title="update changes" arrow>
                                  <button
                                    // onClick={() => handleSaveEdit(tag.id)}
                                    // onClick={handleSaveEdit}
                                    onClick={() => {
                                      handleSaveEdit(tag.id);
                                      handleConfirmUpdate(); // Open the confirmation dialog after the update
                                    }}  
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
                                    onClick={() => handleEdit(tag.id, tag.name)}
                                    className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                    type="button"
                                  >
                                    <span className="sr-only">Edit button</span>
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
                                    onClick={() => handleDelete(tag.id)}
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
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                      />
                                    </svg>
                                  </button>
                                </Tooltip>

                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </Box>
            <TagModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </div>
        </div>

        {tags.length >=5 && (
        <div className="flex justify-center items-center mt-5 mb-5">
          <Pagination
            currentPage={currentFilePage}
            totalPages={Math.ceil(tags.length / FilePerPage)}
            setCurrentPage={setCurrentFilePage}
          />
        </div>
        )}
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
        tagId={deleteTagId}
      />

<UpdateConfirmationPopup
  isOpen={isUpdateConfirmationOpen}
  onClose={() => setIsUpdateConfirmationOpen(false)}
  onConfirm={() => {
    setIsUpdateConfirmationOpen(false);
    handleSaveEdit(updateTagId);
    window.location.reload();
  }}
/>

    </>
  );
};
export default CreateEditTag;