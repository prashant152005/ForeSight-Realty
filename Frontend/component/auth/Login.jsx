import React, { useState } from 'react';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../../src/store';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage user credentials
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4004/api/login", credentials);

      // Store user ID in session storage
      sessionStorage.setItem("id", response.data.userResponse._id);

      // Dispatch login action
      dispatch(authActions.login());

      // Reset form fields
      setCredentials({
        email: "",
        password: ""
      });
      toast.success("login successful");
      navigate("/");

    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="sub-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={credentials.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            value={credentials.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account ?
          <br />
          <Link to="/signup">Create a new account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
