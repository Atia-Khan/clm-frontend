import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import CustomizedMenus from "./upload/MenuTabs";
import Pagination from "./upload/Pagination";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";

const FileListView = () => {
  const [fileList, setFileList] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
      setFirstName(obj.first_name); // Update firstName
      setLastName(obj.last_name); // Update lastName
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/file/list/`
      );
      const files = response.data.file_list.map((file) => ({
        ...file,
        labels: [],
      }));
      const filteredFiles = files.filter(
        (file) => file.fields.account_id === user.id
      );
      setFileList(filteredFiles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handledocx = () => {
    if (
      selectedFile &&
      selectedFile.fields &&
      selectedFile.fields.download_url
    ) {
      const url = selectedFile.fields.download_url.split("googleapis.com")[1];
      const encodedURL = encodeURIComponent(url);
      console.log("Encoded URL:", encodedURL);
      navigate(`/wordDocx?doc=${encodedURL}`);
    } else {
      console.error("No valid download URL for the selected file.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/folder/list/`
        );
        const data = await response.json();
        setFolderList(data.folder_list);
      } catch (error) {
        console.error("Error fetching folder data", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, "file/"); // Assuming your files are stored in 'files/' path
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/folder/list/`
        );
        const items = await listAll(storageRef);

        const files = await Promise.all(
          items.items.map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return {
              fileName: item.name,
              downloadURL: downloadURL,
            };
          })
        );

        setFolderList(
          files.map((file) => ({
            fields: { name: file.fileName },
            downloadURL: file.downloadURL,
          }))
        );

        const data = await response.json();
        setFolderList(
          files.map((file) => ({
            fields: { name: file.fileName },
            downloadURL: file.downloadURL,
          }))
        );
        console.log(files, "");
      } catch (error) {
        console.error("Error fetching folder data", error);
      }
    };
    fetchData();
  }, []);
  const handleFileSelect = (file) => {
    console.log("Selected File:", file); // Add this line for debugging
    if (selectedFile && selectedFile.pk === file.pk) {
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
    const selectedFileIndex = fileList.findIndex((f) => f.pk === file.pk);
    const newPage = Math.ceil((selectedFileIndex + 1) / itemsPerPage);
    setCurrentPage(newPage);
  };
  const handleDelete = async (fileId, popupState) => {
    try {
      if (fileId === undefined) {
        console.error("File ID is undefined. Skipping delete.");
        return;
      }
      console.log("Deleting file with ID:", fileId);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/file/delete/${fileId}/`
      );
      const updatedFileList = fileList.filter((file) => file.pk !== fileId);
      setFileList(updatedFileList);
      if (selectedFile && selectedFile.pk === fileId) {
        setSelectedFile(null);
      }
      popupState.close();
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };
  const toggleTagInArray = (array, tag) => {
    const index = array.indexOf(tag);
    if (index === -1) {
      return [...array, tag];
    } else {
      const updatedTags = [...array];
      updatedTags.splice(index, 1);
      return updatedTags;
    }
  };

  const handleLabelSelect = (label) => {
    // Check if there is a selected file
    if (!selectedFile || !selectedFile.pk) {
      console.error("No selected file or file ID. Aborting tag update.");
      return;
    }
    const fileId = selectedFile.pk;
    setSelectedTags((prevTags) => toggleTagInArray(prevTags, label));
    setFileList((prevFileList) => {
      const updatedFileList = prevFileList.map((file) =>
        file.pk === fileId
          ? {
              ...file,
              fields: {
                ...file.fields,
                tags: toggleTagInArray(file.fields.tags, label),
              },
            }
          : file
      );
      return updatedFileList;
    });
  };
  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const filteredFiles = fileList.filter((file) => {
    const nameMatch =
      file.fields &&
      file.fields.name &&
      file.fields.name.toLowerCase().includes(searchQuery.toLowerCase());
    const tagsMatch =
      file.fields &&
      file.fields.tags &&
      file.fields.tags.some(
        (tag) =>
          tag.name &&
          typeof tag.name === "string" &&
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const folderMatch =
      file.fields &&
      file.fields.folder &&
      file.fields.folder.toLowerCase().includes(searchQuery.toLowerCase());

    if (!filterOption) {
      return nameMatch || tagsMatch || folderMatch;
    } else if (filterOption === "fileName") {
      return nameMatch;
    } else if (filterOption === "tags") {
      return tagsMatch;
    } else if (filterOption === "folder") {
      return folderMatch;
    }

    return true;
  });

  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  console.log(currentFiles, "dfdsf=============fdsdf=========");

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };
  return (
    <>
      <div className="mx-auto max-w-7xl px-12 lg:px-12 w-100">
        <div className="flex items-center justify-between -mb-12 mt-24">
          <h5 className="text-4xl font-bold leading-none ml-8 font-body mt-8">
            Dashboard
          </h5>
        </div>
        <div className="flex items-center justify-between mt-2 mr-10 mb-4">
          <FormControl style={{ width: "19%", marginLeft: "60%" }}>
            <InputLabel id="filter-option-label">Search By Filter</InputLabel>
            <Select
              labelId="filter-option-label"
              id="filter-option-select"
              value={filterOption || ""}
              onChange={handleFilterOptionChange}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="fileName">File Name</MenuItem>
              <MenuItem value="tags">Tags</MenuItem>
              <MenuItem value="folder">Folder</MenuItem>
            </Select>
          </FormControl>
          <TextField
            sx={{ width: 300, marginLeft: 2, borderRadius: "45px" }}
            variant="outlined"
            className="flex-1, font-body rounded-full"
            type="text"
            placeholder="Search files by name or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className=" max-w-10xl px-6 lg:px-8">
          {selectedFile && (
            <div style={{ marginTop: "5%" }}>
              {selectedFile && (
                <div style={{ marginBottom: "-5%" }}>
                  <CustomizedMenus
                    file={selectedFile} // Pass the selectedFile state as a prop
                    handleDelete={handleDelete}
                    fileId={selectedFile ? selectedFile.pk : null}
                    onOpenDocument={handledocx}
                    onLabelSelect={handleLabelSelect}
                    selectedTags={selectedTags}
                  />
                </div>
              )}
            </div>
          )}
          <TableContainer
            style={{ borderRadius: "0.6rem" }}
            className="w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-20 sm:rounded-lg dark:focus:ring-sky-800 shadow-lg shadow-sky-8 00/50 dark:shadow-lg dark:shadow-sky-800/80 rounded-3xl"
            component={Paper}
          >
            <Table>
              <TableHead className="w-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-16">
                <TableRow
                  style={{ borderRadius: "50px" }}
                  className=" bg-cyan-500 dark:bg-cyan-600"
                >
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "30%",
                    }}
                    className="font-body text-white"
                  >
                    {" "}
                    File Name
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "20%",
                    }}
                    className="font-body text-white"
                  >
                    Owner
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "20%",
                    }}
                    className="font-body text-white"
                  >
                    Folder
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "20%",
                    }}
                    className="font-body text-white"
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                    <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : fileList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentFiles.map((file, i) => (
                    <TableRow
                      key={file.pk}
                      onClick={() => handleFileSelect(file)}
                      sx={{
                        backgroundColor:
                          selectedFile === file ? "lightblue" : "inherit",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "lightgray",
                        },
                      }}
                    >
                      <TableCell
                        style={{
                          fontSize: "16px",
                          fontWeight: "550",
                          width: "40%",
                        }}
                        className="font-body"
                      >
                        <Link
                          to={`/file-details/${file.pk}`}
                          className="black-link hover:underline"
                        >
                          {file.fields.name}
                          {file.fields.tags &&
                            file.fields.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-0.3 rounded-full mr-2 ml-2 text-sm"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: selectedTags.includes(
                                    tag.name
                                  )
                                    ? "blue"
                                    : tag.color,
                                  color: "white",
                                  marginRight:
                                    index < tag.length - 1 ? "8px" : "0",
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                        </Link>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          marginLeft: "20%",
                          width: "30%",
                        }}
                        className="font-body"
                      >
                        <Link to="#" className="black-link hover:underline">
                          {`${firstName} ${lastName}`}
                        </Link>
                      </TableCell>
                      <TableCell className="font-body">
                        <p style={{ fontSize: "16px" }}>
                          {file.fields.folder ? (
                            <span>{file.fields.folder}</span>
                          ) : (
                            <span className=" font-bold">----------</span>

                          )}
                        </p>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          marginLeft: "20%",
                          width: "20%",
                        }}
                        className="font-body"
                      >
                        <p style={{ fontSize: "16px" }}>
                          {file.fields.created_at
                            ? format(
                                new Date(file.fields.created_at),
                                "MM/dd/yyyy hh:mm a"
                              )
                            : "------"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {filteredFiles.length >= 10 && (
          <div className="flex justify-center items-center mt-5 mb-5">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredFiles.length / itemsPerPage)}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default FileListView;
