import React, { useState } from 'react';
import './auth.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const Signup = () => {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before starting
    console.log(credentials);

    try {
      const response = await axios.post("http://localhost:4004/api/register", credentials);
      console.log(response.data);

      // Reset the form after successful registration
      setCredentials({
        username: "",
        email: "",
        phonenumber: "",
        password: "",
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="sub-container">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="username"
            required
            value={credentials.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={credentials.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Mobile no."
            name="phonenumber"
            required
            value={credentials.phonenumber}
            onChange={handleChange}
            pattern="\d{10}"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            value={credentials.password}
            onChange={handleChange}
          />
          <button type="submit">Signup</button>
        </form>
        <p className="auth-switch">
          Already have an account ?
          <br />
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
