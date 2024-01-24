import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import axios from "axios";
import Header from "../pages/Home/components/Header";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
const Login = ({ login, isAuthenticated, error }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setLoading(false);
    }
  };
  const continueWithGoogle = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`
      );
      window.location.replace(res.data.authorization_url);
    } catch (err) {}
  };
  return (
    <>
      <Header />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-sky-900">
            Sign in to DocuVault{" "}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={(e) => onSubmit(e)} action="# " className="space-y-6">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 font-body"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  required
                  type="email"
                  className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
                  placeholder=""
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 font-body"
              >
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="border-2 border-gray-200 p-2 pr-10 rounded-md w-full focus:border-sky-700 focus:outline-none"
                  placeholder=""
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-sky-700 hover:text-sky-800 focus:outline-none"
                >
                  {showPassword ? (
                    <VisibilityIcon style={{ fontSize: '24px' }} />
                  ) : (
                    <VisibilityOffIcon style={{ fontSize: '24px' }}/>
                  )}
                </button>
              </div>
              <div className="text-sm mt-1">
                <Link
                  to="/reset-password"
                  className="font-semibold text-sky-700 hover:text-sky-800"
                >
                  Forgot your Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="text-white focus:ring-4 w-full focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
              style={{ backgroundColor: "#1CA1D8" }}
              disabled={loading}
            
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Login'}
            </button>
          </form>
        </div>
        <br />
        <div className="flex flex-col items-center">
          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-sky-700 hover:text-sky-800">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
});
export default connect(mapStateToProps, { login })(Login);
