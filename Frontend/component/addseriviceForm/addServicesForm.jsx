import React, { useState, useEffect } from 'react';
import './addServicesForm.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../servicecard/ServiceCard';

const ServiceForm = () => {
  const [service, setService] = useState({
    fullName: '',
    shopName: '',
    address: '',
    pincode: '',
    city: '',
    country: '',
    contactNumber: '',
    profession: 'Painter',
  });

  const [userId, setUserId] = useState(null);
  const [services, setServices] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navigateToListing = () => {
    navigate('/listyourproperty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchUserServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4004/api3/getallserviceslistedbyuser/${userId}`);
      setServices(response.data.services);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching services.');
    }
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('id');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log("User ID retrieved from sessionStorage:", storedUserId);
    } else {
      toast.error('User ID not found. Please log in.');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    if (serviceId) {
      setIsEdit(true);
      setEditServiceId(serviceId);
      fetchServiceDetails(serviceId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      console.log("Fetching services for userId:", userId);
      fetchUserServices(userId);
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setService({
      fullName: '',
      shopName: '',
      address: '',
      pincode: '',
      city: '',
      country: '',
      contactNumber: '',
      profession: 'Painter',
    });
    setIsEdit(false);
    setEditServiceId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User is not logged in. Please log in to submit a service.');
      return;
    }

    let serviceData = { ...service, user: userId };
    console.log("this is service data", serviceData);

    try {
      setLoading(true);
      if (isEdit && editServiceId) {
        // Update the service using `editServiceId`
        await axios.put(`http://localhost:4004/api3/updateservice/${editServiceId}`, serviceData);
        toast.success('Service updated successfully!');
      } else {
        // Add new service if `isEdit` is false
        await axios.post('http://localhost:4004/api3/addservice', serviceData);
        toast.success('Service added successfully!');
      }

      fetchUserServices(userId);
      resetForm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Error submitting service.';
      toast.error(errorMessage);
    }
  };

  const handleEditService = (serviceData) => {
    setIsEdit(true);
    setService(serviceData);
    setEditServiceId(serviceData._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteService = async (serviceId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4004/api3/deleteservice/${serviceId}`);
      toast.success('Service deleted successfully!');
      fetchUserServices(userId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error deleting service.');
    }
  };

  return (
    <div className="addserviceform">
      <ToastContainer />
      <button onClick={navigateToListing} className="addserviceform__toggle-form-btn">
        Add Property
      </button>
      <h2>{isEdit ? 'Edit Your Service' : 'Add Your Service'}</h2>

      <div className="addserviceform__propertyform">
        <form onSubmit={handleSubmit}>
          <div className="addserviceform__g_left">
            <div className="addserviceform__form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={service.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="addserviceform__form-group">
              <label>Shop Name:</label>
              <input
                type="text"
                name="shopName"
                value={service.shopName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="addserviceform__form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={service.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="addserviceform__form-group">
              <label>Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={service.pincode}
                onChange={handleChange}
                required
                pattern="\d{6}"
                title="Pincode must be a 6-digit number"
              />
            </div>
            <div className="addserviceform__form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={service.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="addserviceform__form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={service.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="addserviceform__form-group">
              <label>Contact Number:</label>
              <input
                type="tel"
                name="contactNumber"
                value={service.contactNumber}
                onChange={handleChange}
                required
                pattern="\d{10}"
                title="Contact number must be a 10-digit number"
              />
            </div>
            <div className="addserviceform__form-group">
              <label>Profession:</label>
              <select name="profession" value={service.profession} onChange={handleChange}>
                <option value="Painter">Painter</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Interior Designer">Interior Designer</option>
                <option value="Pest Control">Pest Control</option>
              </select>
            </div>
          </div>
          <button type="submit" className="addserviceform__submit_btn">
            {loading ? 'Loading...' : isEdit ? 'Update Service' : 'Add Service'}
          </button>
        </form>
      </div>

      <div className="service-form__service-list">
        <h2>Your Listed Services</h2>
        <div className="service-list">
          {loading ? (
            <p>Loading services...</p>
          ) : services.length > 0 ? (
            services.map((serviceData) => (
              <div key={serviceData._id} className="service-card-container">
                <ServiceCard
                  fullName={serviceData.fullName}
                  shopName={serviceData.shopName}
                  address={serviceData.address}
                  city={serviceData.city}
                  country={serviceData.country}
                  pincode={serviceData.pincode}
                  contactNumber={serviceData.contactNumber}
                  profession={serviceData.profession}
                  serviceId={serviceData._id}
                />
                <div className="service-card-actions">
                  <button onClick={() => handleEditService(serviceData)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteService(serviceData._id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No services added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
