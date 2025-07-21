import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './more_properties_by_same_seller.css';
import Propertycard from '../propertycard/Propertycard';
import { ToastContainer, toast } from 'react-toastify';

function MorePropertiesBySameSeller() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user details and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`http://localhost:4004/api/getuser/${id}`);
        setUserDetails(userResponse.data.user);

        // Fetch properties listed by the user
        const propertiesResponse = await axios.get(`http://localhost:4004/api2/getallproperties/${id}`);
        const properties = propertiesResponse.data.properties || [];
        setUserProperties(properties);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details or properties:', error);
        toast.error('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p className="loading-message">Loading user details and properties...</p>;
  }

  if (!userDetails) {
    return <p className="error-message">User not found.</p>;
  }

  return (
    <div className="more-properties-by-same-seller">
      <ToastContainer />
      <div className="seller-info">
        <img
          className="seller-image"
          src={userDetails.profileImage || 'https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png'}
          alt="User"
        />
        <div className="seller-details2">
          <h1>{userDetails.username}'s Properties</h1>
          <div>
            <p>Email: {userDetails.email}</p>
            <p>Phone: {userDetails.phonenumber}</p>
          </div>
        </div>
      </div>

      <div className="properties-list">
        <h2>Properties Listed by {userDetails.username}</h2>
        {userProperties.length > 0 ? (
          <div className="properties-grid">
            {userProperties.map((property) => (
              <Propertycard
                key={property._id}
                id={property._id}
                title={property.title}
                description={property.description}
                address={property.address}
                city={property.city}
                country={property.country}
                status={property.status}
                price={property.price}
                img={property.img}
                bedroom={property.bedrooms}
              />
            ))}
          </div>
        ) : (
          <p>No properties listed by this seller.</p>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="go-back-button">
        Go Back
      </button>
    </div>
  );
}

export default MorePropertiesBySameSeller;
