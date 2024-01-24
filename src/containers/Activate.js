import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { verify } from "../actions/auth";
import { useParams } from "react-router-dom";
// import VerificationComplete from './VerificationCompleted';
import Login from "./Login";
import { toast } from "sonner";
const Activate = ({ verify }) => {
  const [verified, setVerified] = useState(false);
  const { uid, token } = useParams();
  const verifyAccount = () => {
    verify(uid, token);
    setVerified(true);
    toast.success(
      "Congratulations! Your account has been activated successfully."
    );
  };
  if (verified) {
    return <Login />;
  }
  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-1200 text-center">
          Activate Your Account
        </h2>
        <button
          onClick={verifyAccount}
          style={{ backgroundColor: "#1CA1D8" }}
          className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring focus:border-indigo-500">
          Verify
        </button>
        <div className="mt-4 text-center text-green-600">
          {verified &&
            "Congratulations! Your account has been activated successfully."}
        </div>
      </div>
    </div>
  );
};
export default connect(null, { verify })(Activate);