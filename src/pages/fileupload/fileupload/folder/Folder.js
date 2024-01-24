import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Folder = ({ onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [isDoubleDropdownOpen, setIsDoubleDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [subfolders, setSubFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null); // New state
  const [user, setUser] = useState({});


  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDoubleDropdown = () => {
    setIsDoubleDropdownOpen(!isDoubleDropdownOpen);
  };

  const handleOptionSelect = (folder) => {
    setSelectedOption(folder.name);
    setIsDropdownOpen(false);
    console.log(folder.id); // Now 'folder.id' should be defined
    // Pass the folder ID to the parent component (Upload.js)
    onSelect(folder.id);
  };

  const handleUploadNavigation = () => {
    navigate("/display-folders");
  };

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/folder/list/`);
        console.log("Fetched folders:", response.data);
  
        const foldersArray = response.data.folder_list || [];
        
        // Assuming user.id is available in the component state
        const userId = user.id;
  
        const filteredFolders = foldersArray.filter(folder => folder.account_id === userId);
  
        const reversedFolders = filteredFolders.slice().reverse();
  
        setFolderList(reversedFolders);
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    };
  
    fetchFolder();
  }, [user]);
  
  useEffect(() => {
    // Fetch data when the component mounts or selectedFolderId changes
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/details/${selectedFolderId}/`
        );
        const data = await response.json();
        setSubFolders(data.folder_list);
        // You can also set files if needed: setFiles(data.file_list);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (selectedFolderId !== null) {
      fetchData();
    }
  }, [selectedFolderId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsDoubleDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="sm:col-span-2 relative" ref={dropdownRef}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={selectedOption}
            readOnly
            style={{ color: "black" }}
            placeholder="Select or Create folder"
            className="border-2 border-gray-400 p-2 t rounded-md w-full  focus:outline-none"
            onClick={toggleDropdown}

          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "8px",
            }}
            onClick={toggleDropdown}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        {isDropdownOpen && (
          <div className="z-10 absolute mt-2">
            <div
              id="multi-dropdown"
              className="bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="multiLevelDropdownButton"
              >
                <li>
                  <button
                    onClick={handleUploadNavigation}
                    style={{ color: "black" }}
                    className="block px-4 py-2 dark:text-black transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-800"
                  >
                    Create & edit folder
                  </button>
                </li>
                <li>
                  <button
                    id="doubleDropdownButton"
                    style={{ color: "black" }}
                    className="flex items-center justify-between w-full px-4 py-2 dark:text-black transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-800"
                    type="button"
                    onClick={toggleDoubleDropdown}
                  >
                    Show all folder
                  </button>

                  {isDoubleDropdownOpen && (
                    <div className="z-10 absolute left-44 mt-0">
                      <div className="bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="doubleDropdownButton"
                        >
                          {folderList.map((folder) => (
                            <li key={folder.id}>
                              <a
                                href="#"
                                onClick={() => handleOptionSelect(folder)}
                                style={{ color: "black" }}
                                className="block px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-800"
                              >
                                {folder.name}
                              </a>
                            </li>
                          ))} 
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Folder;