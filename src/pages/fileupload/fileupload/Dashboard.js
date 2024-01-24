import React from "react";
import { SiHomebridge } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handledoc = () => {
    navigate("/upload");
  };
  const handlefolder = () => {
    navigate("/display-folders");
  };
  const handletag = () => {
    navigate("/create-tag");
  };

  return (
    <div className="flex w-100 justify-center items-center bg-white">
      <div className="">
        <div className="flex items-center mb-14">
          <div>
            <SiHomebridge className="text-blue-500 text-7xl mr-4 mb-14 m-auto" />
            <p className="text-3xl font-semibold text-center mt-3 ">
              Welcome to Your
              <br />
              <p className="font-body text-3xl font-bold mb-8">DocVault Dashboard</p>
            </p>
          </div>
        </div>
        <div className="">
          <p className="text-xl font-semibold text-gray-600">
            <strong  style={{ marginLeft: "-50%"}}>GET STARTED:</strong>
          </p>
        </div>
        <div className="mt-4 mb-3" style={{ width: "180%", marginLeft: "-50%"}}>
          <a
            onClick={handledoc}
            className="group flex items-center rounded-md border border-gray-300 bg-gray-100 py-4 px-4 !no-underline transition-colors duration-150 hover:border-blue-700 hover:border-opacity-50 hover:bg-gray-50 mb-3 ">
            <svg
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="iconify iconify--heroicons-outline -ml-px mr-3 h-6 w-auto stroke-current text-slate-500 group-hover:text-blue-600">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2"></path>
            </svg>
            <span style = {{cursor: "pointer"}} className="leading-none text-slate-600 transition-all duration-150 group-hover:text-blue-600 ">
              Import a document
            </span>
            <svg
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="iconify iconify--heroicons-outline ml-auto h-5 w-auto translate-x-0 stroke-current text-slate-500 transition-all duration-150 group-hover:translate-x-1 group-hover:text-blue-600 group-hover:opacity-100">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
          <a
            onClick={handlefolder}
            // style={{ width: "70%", cursor: "pointer" }}
            className="group flex items-center rounded-md border border-slate-200 bg-slate-100 py-4 px-4 !no-underline transition-colors duration-150 hover:border-blue-700 hover:border-opacity-50 hover:bg-slate-50 mb-3">
            <svg
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
              className="iconify iconify--heroicons-outline -ml-px mr-3 h-6 w-auto stroke-current text-slate-500 group-hover:text-blue-600">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2"></path>
            </svg>
            <span style = {{cursor: "pointer"}} className="leading-none text-slate-600 transition-all duration-150 group-hover:text-blue-600 ">
              Create a Folder
            </span>
            <svg
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
              className="iconify iconify--heroicons-outline ml-auto h-5 w-auto translate-x-0 stroke-current text-slate-500 transition-all duration-150 group-hover:translate-x-1 group-hover:text-blue-600 group-hover:opacity-100">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
          <a
            onClick={handletag}
            // style={{ width: "70%", cursor: "pointer" }}
            className="group flex items-center rounded-md border border-slate-200 bg-slate-100 py-4 px-4 !no-underline transition-colors duration-150 hover:border-blue-700 hover:border-opacity-50 hover:bg-slate-50 mb-3">
            <svg
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
              className="iconify iconify--heroicons-outline -ml-px mr-3 h-6 w-auto stroke-current text-slate-500 group-hover:text-blue-600">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732"></path>
            </svg>
            <span style = {{cursor: "pointer"}} className="leading-none text-slate-600 transition-all duration-150 group-hover:text-blue-600 ">
              Create a Tag
            </span>
            <svg
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
              className="iconify iconify--heroicons-outline ml-auto h-5 w-auto translate-x-0 stroke-current text-slate-500 transition-all duration-150 group-hover:translate-x-1 group-hover:text-blue-600 group-hover:opacity-100">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;


