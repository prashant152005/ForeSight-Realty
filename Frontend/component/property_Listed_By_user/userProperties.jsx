import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userProperties.css';
import { toast } from 'react-toastify';
import Propertycard from '../propertycard/Propertycard';

const UserProperties = ({ fetchedproperties, onEditProperty }) => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    if (fetchedproperties) {
      setProperties(fetchedproperties);  
      setLoading(false);  
    } else {
      setLoading(false);  
    }
  }, [fetchedproperties]);

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:4004/api2/deleteproperty/${propertyId}`);
      setProperties(properties.filter((property) => property._id !== propertyId));
      toast.success('Property deleted successfully.');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property. Please try again.');
    }
  };

  const handleEdit = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:4004/api2/getproperty/${propertyId}`);
      const propertyData = response.data.property;

      if (onEditProperty) {
        onEditProperty(propertyData); 
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      if (error.response && error.response.status === 404) {
        toast.error("Property not found.");
      } else {
        toast.error("Error fetching property details. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading properties...</div>;
  }

  return (
    <div>
      {Array.isArray(properties) && properties.length > 0 ? (
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property._id} className="property-card-container">
              <Propertycard
                id={property._id}
                title={property.title}
                description={property.description}
                address={property.address}
                city={property.city}
                state={property.state}
                country={property.country}
                status={property.status}
                price={property.price}
                img={property.img}
                bedroom={property.bedrooms}
              />
              <div className="property-actions">
                <button onClick={() => handleEdit(property._id)}>Edit</button>
                <button onClick={() => handleDelete(property._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No properties listed yet.</div> 
      )}
    </div>
  );
};

export default UserProperties;
