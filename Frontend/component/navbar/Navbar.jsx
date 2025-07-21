import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../src/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Navbar = () => {
  const id = sessionStorage.getItem("id");
  const isLoggedIn = useSelector((state) => state.isLogedIn);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    sessionStorage.clear("id");
    setIsOpen(false);
    toast.success("Logged out successfully");
    console.log("Logged out successfully");
  };

  const handleMyListing = async (e) => {
    e.preventDefault();
    console.log(id)

    try {
      if (!id || null) {
        toast.error("Please log in to view your listings.");

      } else {
        const response = await axios.get(`http://localhost:4004/api/getuser/${id}`, {
          headers: { "Authorization": `Bearer ${id}` },
        });

        if (response.status === 200) {
          navigate("/listyourproperty");
        } else {
          toast.error("Your session has expired. Please log in again.");
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const navigateToListing = () => {
    navigate('/Propertyfilter');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Foresight <span>realty </span></Link>
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-item" onClick={handleToggle}>Home</Link>

          <Link to="/Propertyfilter" className='navbar-item' onClick={navigateToListing}>
            Properties
          </Link>

          {/* My Listing button */}
          <Link
            to="/listyourproperty"
            className="navbar-item"
            onClick={handleMyListing}
          >
            My Listing
          </Link>

          {/* Only show login button if user is not logged in */}
          {!isLoggedIn ? (
            <Link to="/login" className="navbar-item login-btn">Login</Link>
          ) : (
            <Link to="/" className="navbar-item logout-btn" onClick={handleLogout}>Logout</Link>
          )}
        </div>
        <div className="menu-icon" onClick={handleToggle}>
          <div className={`menu-line ${isOpen ? 'open' : ''}`}></div>
          <div className={`menu-line ${isOpen ? 'open' : ''}`}></div>
          <div className={`menu-line ${isOpen ? 'open' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
