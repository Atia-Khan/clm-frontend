import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firestore/firestore";
import axios from "axios";
import {
  Table,
  TableBody,
  TextField,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CustomizedMenus from "./MenuTabs";
import Header from "../../../Header/header";
import Sidebar from "../../../Sidebar/Sidebar";
import Pagination from "../upload/Pagination"; // Import your Pagination component
import { Tooltip } from "@mui/material";
import AuditTrail from "./AuditTrail";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

const ReceiveDoc = () => {
  const [user, setUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [receivedDocs, setReceivedDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState(null);
  const [auditTrailModalOpen, setAuditTrailModalOpen] = useState(false);
  const [selectedAuditTrailData, setSelectedAuditTrailData] = useState(null);
  const navigate = useNavigate();
  const [signedTimes, setSignedTimes] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this based on your preference

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  const handledocx = () => {
    if (selectedFile && selectedFile.fileUrl) {
      const url = selectedFile.fileUrl.split("googleapis.com")[1];
      const encodedURL = encodeURIComponent(url);
      console.log("Encoded URL:", encodedURL);
      navigate(`/wordDocx?doc=${encodedURL}`);
    } else {
      console.error("No valid download URL for the selected file.");
    }
  };
  const formatDateAndTime = (dateTime) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    return dateTime.toLocaleString(undefined, options);
  };

  useEffect(() => {
    const fetchReceivedDocs = async () => {
      if (user.email) {
        setLoading(true);

        const q = query(
          collection(firestore, "sendData"),
          where("senderemail", "==", user.email)
        );
        try {
          const querySnapshot = await getDocs(q);
          const docsData = querySnapshot.docs.map((doc) => doc.data());
          const newArray = [];
          docsData.forEach((doc) => {
            const { addUserEmails, ...rest } = doc;
            addUserEmails.forEach((recipient) => {
              newArray.push({ ...rest, recipient });
            });
          });
          console.log("Fetched documents:", newArray);
          setReceivedDocs(newArray);
        } catch (error) {
          console.error("Error fetching received documents:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReceivedDocs();
  }, [user.email]);
  const filteredDocs = receivedDocs.filter((file) => {
    const fileNameMatch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const receiverNameMatch = file.recipient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const statusMatch = file.recipient.documentSigned ? "Signed" : "Not Signed";

    if (!filterOption) {
      return (
        fileNameMatch ||
        file.recipient.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        receiverNameMatch ||
        statusMatch.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (filterOption === "fileName") {
      return fileNameMatch;
    } else if (filterOption === "senderEmail") {
      return file.recipient.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    } else if (filterOption === "Signed") {
      return statusMatch.toLowerCase() === "signed";
    } else if (filterOption === "NotSigned") {
      return statusMatch.toLowerCase() === "not signed";
    }

    return true;
  });

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };
  const openDocument = async (firestoreDocument) => {
    const { envelope_id, recipient, documentId } = firestoreDocument;
    const userEmail = user.email;

    localStorage.setItem('envelope_id', envelope_id)
    localStorage.setItem('signer_email', userEmail)

    const { name, clientUserId } = recipient;
    const reqUrl = `${process.env.REACT_APP_API_URL}/file/get-envelop/`;
    const reqBody = {
      authenticationMethod: "none",
      userName: name,
      email: userEmail,
      returnUrl: 'https://ccngl3z4-3000.inc1.devtunnels.ms/signed',
      envelope_id,
    };
    const response = await axios.post(reqUrl, reqBody, {
      withCredentials: true,
    });
    const { url } = JSON.parse(response.data.message);

    // navigate('/sign', { state: url })
    // const encodedURL = encodeURIComponent(url);

    // window.location.href = `/demo.html?doc=${encodedURL}`;
    navigate('/sign', { state: url })

  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleAuditTrailClick = (data) => {
    if (data && data.recipient) {
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);
    } else {
      console.error("Invalid data for Audit Trail");
    }
  };
  return (
    <>
      {/* <div>
        <Header />
        <Sidebar />
      </div> */}
      <div className="mx-auto max-w-7xl px-12 lg:px-12 w-100">
        <div className="flex items-center justify-between -mb-12 mt-24">
          <h5 className="text-4xl font-bold leading-none ml-8 font-body mt-8">
            Sent documents
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
              <MenuItem value="senderEmail">Sender Email</MenuItem>
              <MenuItem value="Signed">Signed</MenuItem>
              <MenuItem value="NotSigned">Not Signed</MenuItem>
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
                    file={selectedFile}
                    fileId={selectedFile ? selectedFile.pk : null}
                    onOpenDocument={handledocx}
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
              <TableHead className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-16">
                <TableRow
                  style={{ borderRadius: "50px" }}
                  className="bg-cyan-500 dark:bg-cyan-600"
                >
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    File Name
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    Owner
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    Receiver
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "12%",
                    }}
                    className="font-body text-white"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    Signed Time
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "20%",
                    }}
                    className="font-body text-white"
                  >
                    Audit Trail
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((file, i) => (
                      <TableRow
                        key={i}
                        onClick={() => openDocument(file)}
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
                            marginLeft: "20%",
                            width: "20%",
                          }}
                          className="font-body"
                        >
                          <Link to="#" className="black-link hover:underline">
                            {file.fileName}
                          </Link>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            marginLeft: "-20%",
                            width: "15%",
                          }}
                          className="font-body"
                        >
                          <Link to="#" className="black-link hover:underline">
                            {file.owner}
                          </Link>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            marginLeft: "20%",
                            width: "25%",
                          }}
                          className="font-body"
                        >
                          <Link to="#" className="black-link hover:underline">
                            {file.recipient.email}
                          </Link>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            marginLeft: "20%",
                            width: "10%",
                            padding: "20px",
                          }}
                          className="font-body"
                        >
                          <Link to="#" className="black-link hover:underline">
                            {file.recipient.documentSigned
                              ? "Signed"
                              : "Not signed"}
                          </Link>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            marginLeft: "20%",
                            width: "15%",
                            padding: "4px",
                          }}
                          className="font-body"
                        >
                          {file.recipient.signed_time ? (
                            new Date(
                              file.recipient.signed_time
                            ).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })
                          ) : (
                            <span className="ml-8 font-bold">----------</span>
                          )}
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            marginLeft: "20%",
                            width: "10%",
                            padding: "20px",
                          }}
                          className="font-body"
                        >
                          <Tooltip title="audit-trail" arrow>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAuditTrailClick(file);
                              }}
                              className="inline-flex items-center justify-center h-6 w-6 p-1 ms-8 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                            >
                              <ContentPasteSearchIcon />
                            </button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
              <AuditTrail
                open={auditTrailModalOpen}
                onClose={() => setAuditTrailModalOpen(false)}
                data={selectedAuditTrailData}
              />
            </Table>
          </TableContainer>
          {filteredDocs.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-5 mb-5">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredDocs.length / itemsPerPage)}
                setCurrentPage={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReceiveDoc;
