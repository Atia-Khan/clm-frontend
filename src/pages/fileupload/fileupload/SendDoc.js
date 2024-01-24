import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../firestore/firestore";
import { addDoc, collection, Timestamp, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { TextField } from "@mui/material";
import "./styles.css";
import axios from "axios";
import emailjs from "emailjs-com";
import { toast } from "sonner";
const SendDocModal = ({ onClose, file }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileUrl = file?.fields?.download_url;
  const fileName = file?.fields?.name;
  const fileId = file?.pk;
  const [emailLines, setEmailLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const EMAILJS_USER_ID = "qw4I1NBEsOmRb3kZT";
  const EMAILJS_SERVICE_ID = "service_jjzd7dn";
  const EMAILJS_TEMPLATE_ID = "template_rz0q7sp";
  emailjs.init(EMAILJS_USER_ID);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInputValue = inputValue.trim();
      if (trimmedInputValue === "") {
        setErrorMessage("Please enter an email address");
      } else if (isValidEmail(trimmedInputValue)) {
        setEmailLines([...emailLines, trimmedInputValue + "\n"]);
        setInputValue("");
        handleAddUser(trimmedInputValue);
        setErrorMessage(""); // Clear error message on success
      } else {
        setErrorMessage("Please enter a valid email address");
      }
    }
  };

  const sendEmail = (emailObj) => {
    const templateParams = {
      to_email: emailObj,
      from_name: user.first_name,
      from_email: user.email,
    };
    console.log(templateParams);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  };
  const handleChipDelete = (emailToDelete) => {
    setEmailLines((prevEmailLines) =>
      prevEmailLines.filter((email) => email !== emailToDelete)
    );
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user !== emailToDelete.trim())
    );
    setUserPermissions((prevUserPermissions) =>
      prevUserPermissions.filter(
        (permission) => permission.email !== emailToDelete.trim()
      )
    );
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
  const handleAddUser = (emailObj) => {
    console.log(emailObj, "emailObj");
    if (emailObj) {
      setUsers([...users, emailObj]);
      setUserPermissions([
        ...userPermissions,
        { email: emailObj, permission: "read" },
      ]);
      setNewUser("");
    }
  };
  const handleSend = async () => {
    if (users.length === 0) {
      setErrorMessage(
        "Please enter at least one email address before sending."
      );
      return;
    }
    setIsLoading(true);
    setLoading(true);
    console.log("Before sendEnvelop - File ID:", fileId);
    setLoading(true);
    const names = users.map((user) => {
      const name = user.split("@");
      return name[0];
    });
    const clientUserIds = users.map(() => Math.floor(Math.random() * 1000000));
    let data = {
      senderemail: user.email,
      addUserEmails: users.map((email, index) => ({
        email,
        name: names[index],
        clientUserId: clientUserIds[index],
        documentSigned: false,
        signed_time: null,
      })),
      requestedTime: serverTimestamp(),
      uid: user.id,
      documentId: fileId,
      fileUrl,
      fileName,
      owner: `${user.first_name} ${user.last_name}`,
    };
    try {
      const { envelope_id } = await sendEnvelop(names, clientUserIds);
      data = { ...data, envelope_id };
      const message = `${user.first_name} ${user.last_name} send this ${fileName} to sign`;
      const messageData = {
        sender: user.email,
        receiverEmails: users,
        message,
        timestamp: serverTimestamp(),
      };
      // const doc = await addDoc(collection(firestore, "sendData"), data);
      const doc1 = await addDoc(
        collection(firestore, "notification"),
        messageData
      );
      console.log(message);
      const doc = await addDoc(collection(firestore, "sendData"), data);
      setUsers([]);
      setNewUser("");
      setUserPermissions([]);
      // users.forEach((user) => {
      //   sendEmail(user, user);
      // });
      console.log("Data sent to Firebase:", doc);
      setIsLoading(false);
      toast.success("File sent successfully");
      navigate("/receive-doc");
      onClose();
    } catch (error) {
      console.error("Error sending data to Firebase:", error);
    } finally {
      setLoading(false);
    }
    setErrorMessage(""); // Clear error message on success
  };
  const sendEnvelop = async (names, clientUserIds) => {
    console.log("Inside sendEnvelop - File ID:", fileId);
    const formData = new FormData();
    formData.append("file_url", fileUrl);
    formData.append("recipient_email", users);
    formData.append("recipient_name", names);
    formData.append("document_id", fileId);
    console.log("File id:", fileId);
    formData.append("client_user_id", clientUserIds);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/send-envelop/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending envelop:", error);
      throw error; // Propagate the error to the caller
    }
  };
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
          <div
            role="status"
            class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
          >
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 ml-6 mt-6">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="w-full p-4 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col">
              <button className="text-black mt-2 mb-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body">
                Sharing file: {fileName}
              </button>
              <div className="relative flex items-center">
                <div className="w-full">
                  <TextField
                    multiline
                    rows={Math.max(2, emailLines.length)}
                    placeholder="Enter emails..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    variant="outlined"
                    style={{
                      width: "100%",
                      resize: "none",
                      marginBottom: "10px",
                      color: errorMessage ? "red" : null, // Set border color to red if there's an error
                    }}
                  />
                  {errorMessage && (
                    <p className="text-red-600 font-body" style={{ color: "red" }}>
                      {errorMessage}
                    </p>
                  )}
                </div>

                <div className="absolute left-4 top-8">
                  {emailLines.map((email, index) => (
                    <Chip
                      key={index}
                      avatar={<Avatar>{email.charAt(0)}</Avatar>}
                      label={email}
                      onDelete={() => handleChipDelete(email)}
                      color="primary"
                      variant="outlined"
                      className="mr-2 mt-2 mb-1"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            className="text-white mt-2 mb-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
            style={{ backgroundColor: "#1CA1D8" }}
            onClick={handleSend}
          >
            Send
          </button>
          <button
            className="text-white mt-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
            style={{ backgroundColor: "#1CA1D8", marginLeft: "10px" }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
export default SendDocModal;
