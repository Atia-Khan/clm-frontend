import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TextField, Box, Tooltip } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import Header from "../../../../../Header/header";
import Sidebar from "../../../../../Sidebar/Sidebar";
import CircularProgress from "@mui/material/CircularProgress";

const SubFolder = () => {
  const { subfolderId, folderId } = useParams();
  const [files, setFiles] = useState([]);
  const [fileTags, setFileTags] = useState({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const decodedFolderName = decodeURIComponent(params.get("folderName"));

  const subfolderName = params.get("subfolderName") || "Unknown Folder";
  const folderName = params.get("folderName") || "Unknown Folder";
  console.log("Folder ID:", folderId);
  console.log("Subfolder ID:", subfolderId);
  console.log("Folder Name:", decodedFolderName);
  console.log("Subfolder Name:", subfolderName);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  const [folderDetails, setFolderDetails] = useState({
    folder_list: [],
    file_list: [],
    parent_folder: [],
  });
  useEffect(() => {
    const fetchFileListWithTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/list/`
        );
        const fileTagsMap = {};
        response.data.file_list.forEach((file) => {
          fileTagsMap[file.pk] = file.fields.tags;
        });
        setFileTags(fileTagsMap);
        setIsLoadingFiles(false)
      } catch (error) {
        console.error("Error fetching file list with tags", error);
      }
      finally{
        setIsLoadingFiles(false)

      }
    };
    const fetchFolderDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/folder/details/${subfolderId}/`
        );
        setFolderDetails(response.data);
      } catch (error) {
        console.error("Error fetching folder details", error);
      }
    };
    if (subfolderId) {
      fetchFolderDetails();
      fetchFileListWithTags();
    }
  }, [subfolderId]);
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
  return (
    <>
      {/* <div>
       <Header/>
       <Sidebar/>
      </div> */}
      <div className="relative isolate overflow-hidden  py-16 sm:py-24 lg:py-32 w-100">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="w-full p-4 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700">
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
              <Link
                to={`/add-subfolder/${folderId}?folderName=${encodeURIComponent(
                  folderName
                )}`}
              >
                <h5 className="text-2xl font-semibold  leading-none text-gray-900 dark:text-black font-body">
                  {`  ${folderName}/`}
                </h5>
              </Link>
              <h5 className="text-2xl font-semibold  leading-none text-gray-900 dark:text-black font-body">
                {`  ${subfolderName}`}
              </h5>
            </div>
            <Box sx={{ maxWidth: 1245, marginTop: 4 }}>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-base text-white uppercase bg-cyan-500 dark:bg-cyan-600 dark:text-white">
                    <tr>
                      <th scope="col" class="px-6 py-4">
                        Files
                      </th>
                      <th scope="col" class="px-6 py-4 ">
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
                    ) : folderDetails.file_list.length === 0 ? (
                      <tr>
                        <td colSpan="2">
                          <p className="px-4 py-2 text-gray-700 text-lg text-center	">
                            No files found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      folderDetails.file_list.map((file) => (
                        <tr
                          key={file.id}
                          className="group hover:bg-gray-100 dark:hover:bg-gray-100 border-b dark:border-gray-300"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 text-gray-500 ml-7 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                              />
                            </svg>
                            <h5 className="px-2 py-4 text-lg  leading-none text-gray-900 dark:text-black font-body">
                              {file.name}
                            </h5>
                            {fileTags[file.id] &&
                              fileTags[file.id].map((tag) => (
                                <span
                                  key={tag.name}
                                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full mt-1 mr-1"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                          </div>
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
          </div>
        </div>
      </div>
    </>
  );
};
export default SubFolder;
