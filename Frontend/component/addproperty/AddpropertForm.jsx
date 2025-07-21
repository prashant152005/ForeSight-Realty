import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AddpropertForm.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserProperties from '../property_Listed_By_user/userProperties';

const PropertyForm = () => {
  const [property, setProperty] = useState({
    img: '',
    title: '',
    description: '',
    address: '',
    city: '',
    pincode: '',
    country: '',
    state: '',
    price: '',
    status: 'sell',
    area: '',
    bedrooms: '',
    parking: 'without parking',
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [states, setStates] = useState([]);
  const [customCountry, setCustomCountry] = useState('');
  const [customState, setCustomState] = useState('');
  const navigate = useNavigate();

  const countryStatesMap = {
    India: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
      'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
      'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 
      'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
      'Puducherry', 'Ladakh', 'Jammu and Kashmir'
    ],
    'United States': [
      'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 
      'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia', 'Washington', 
      'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri', 'Maryland', 
      'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana', 
      'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Iowa', 'Mississippi', 'Arkansas', 
      'Utah', 'Nevada', 'Kansas', 'New Mexico', 'Nebraska', 'West Virginia', 'Idaho', 
      'Hawaii', 'New Hampshire', 'Maine', 'Montana', 'Rhode Island', 'Delaware', 
      'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming', 'District of Columbia'
    ],
    Canada: [
      'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 
      'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island', 
      'Northwest Territories', 'Yukon', 'Nunavut'
    ],
    Australia: [
      'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 
      'Tasmania', 'Australian Capital Territory', 'Northern Territory'
    ],
    'United Kingdom': [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    Germany: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 
      'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 
      'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 
      'Thuringia'
    ],
    France: [
      'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Brittany', 
      'Nouvelle-Aquitaine', 'Normandy', 'Occitanie', 'Hauts-de-France', 'Grand Est', 
      'Pays de la Loire', 'Centre-Val de Loire', 'Corsica', 'Guadeloupe', 'Martinique', 
      'Réunion', 'French Guiana', 'Mayotte'
    ],
    Singapore: [
      'Central Region', 'North-East Region', 'North Region', 'East Region', 'West Region'
    ],
    UAE: [
      'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al-Quwain', 'Fujairah', 'Ras Al Khaimah'
    ],
    Other: []
  };
  

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error('User ID not found. Please log in.');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('propertyId');

    if (propertyId) {
      setIsEdit(true);
      setEditPropertyId(propertyId);
      fetchPropertyDetails(propertyId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProperties();
    }
  }, [userId]);

  const fetchPropertyDetails = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:4004/api2/getproperty/${propertyId}`);
      setProperty(response.data.property);
      if (!countryStatesMap[response.data.property.country]) {
        setCustomCountry(response.data.property.country);
        setCustomState(response.data.property.state);
      }
    } catch (error) {
      toast.error('Error fetching property details.');
    }
  };

  const fetchUserProperties = async () => {
    try {
      const response = await axios.get(`http://localhost:4004/api2/getallproperties/${userId}`);
      setProperties(response.data.properties);
    } catch (error) {
      toast.error('Error fetching properties.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:4004/api4/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProperty((prev) => ({ ...prev, img: response.data.imageUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed.");
    }
  };

  const resetForm = () => {
    setProperty({
      img: '',
      title: '',
      description: '',
      address: '',
      city: '',
      pincode: '',
      country: '',
      state: '',
      price: '',
      status: 'sell',
      area: '',
      bedrooms: '',
      parking: 'without parking',
    });
    setIsEdit(false);
    setEditPropertyId(null);
    setCustomCountry('');
    setCustomState('');
    setStates([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User is not logged in. Please log in to submit a property.');
      return;
    }

    const finalCountry = property.country === 'Other' ? customCountry : property.country;
    const finalState = property.state === 'Other' ? customState : property.state;

    const propertyData = {
      ...property,
      country: finalCountry,
      state: finalState,
      user: userId,
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:4004/api2/updateproperty/${editPropertyId}`, propertyData);
        toast.success('Property updated successfully!');
      } else {
        await axios.post('http://localhost:4004/api2/addproperty', propertyData);
        toast.success('Property added successfully!');
      }

      fetchUserProperties();
      resetForm();
    } catch (error) {
      toast.error('Error submitting property.');
    }
  };

  const handleEditProperty = (propertyData) => {
    setProperty(propertyData);
    setIsEdit(true);
    setEditPropertyId(propertyData._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setProperty((prev) => ({
      ...prev,
      country,
      // state: '',
    }));

    if (country === 'Other') {
      setStates([]);
    } else {
      setStates(countryStatesMap[country] || []);
    }
  };

  return (
    <div className="property-form-container">
      <ToastContainer />
      <button className='addpropertyform__toggle-form-btn' onClick={() => navigate('/addservice')}>Add Services</button>
      <h2>{isEdit ? 'Edit Your Property' : 'List Your Property'}</h2>

      <div className="propertyform">
        <form onSubmit={handleSubmit}>
          <div className="g_left">
            <div className="form-group">
              <label>Country :</label>
              <select name="country" value={property.country} onChange={handleCountryChange} required>
                <option value="">Select Country</option>
                {Object.keys(countryStatesMap).map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {property.country === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter country name"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label>State :</label>
              {property.country === 'Other' ? (
                <input
                  type="text"
                  placeholder="Enter state name"
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  required
                />
              ) : (
                <select name="state" value={property.state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label>City :</label>
              <input type="text" name="city" value={property.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Title :</label>
              <input type="text" name="title" value={property.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description :</label>
              <textarea rows="3" name="description" value={property.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Address :</label>
              <textarea rows="3" name="address" value={property.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pincode :</label>
              <input type="text" name="pincode" value={property.pincode} onChange={handleChange} required pattern="\d{6}" title="Pincode must be a 6-digit number" />
            </div>
            <div className="form-group">
              <label>Area (in sq. ft) :</label>
              <input type="number" name="area" value={property.area} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Number of Bedrooms :</label>
              <input type="number" name="bedrooms" value={property.bedrooms} onChange={handleChange} required />
            </div>
          </div>

          <div className="g_right">
            <div className="form-group">
              <label>Upload Image :</label>
              <img
                src={
                  property.img
                    ? property.img.startsWith('http')
                      ? property.img
                      : `http://localhost:4004${property.img}`
                    : 'https://i.postimg.cc/3wvwhLJP/Screenshot-2025-04-23-163935.png'
                }
                alt="upload your property image"
                className="uploaded_img"
              />
              <input type="file" className='upload-image' accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label>Status :</label>
              <select name="status" value={property.status} onChange={handleChange}>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Parking :</label>
              <select name="parking" value={property.parking} onChange={handleChange}>
                <option value="without parking">Without Parking</option>
                <option value="with parking">With Parking</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price :</label>
              <input type="number" name="price" value={property.price} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="submit_btn">{isEdit ? 'Save Changes' : 'Add Property'}</button>
        </form>
      </div>

      <h2>Your Listed Properties</h2>
      <UserProperties userId={userId} fetchedproperties={properties} onEditProperty={handleEditProperty} />
    </div>
  );
};

export default PropertyForm;
