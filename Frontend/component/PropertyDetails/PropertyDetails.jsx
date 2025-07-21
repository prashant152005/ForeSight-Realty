import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PropertyDetails.css';
import { ToastContainer, toast } from 'react-toastify';
import Propertycard from '../propertycard/Propertycard';
import Map from '../Map/map';
import ServiceCard from '../servicecard/ServiceCard';

// Icons
import { PiPhoneCallFill } from "react-icons/pi";
import { IoMdMail, IoLogoWhatsapp } from "react-icons/io";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Variables
    const [property, setProperty] = useState(null);
    const [similarProperty, setSimilarProperty] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [predictedPrice, setPredictedPrice] = useState(null);

    const BASE_URL = "http://localhost:4004";

    // Navigates to the property listing page.
    const navigateToListing = () => {
        navigate('/Propertyfilter');
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Navigates to view more properties by the seller.
    const handleUserDetailAndProperties = () => {
        if (userDetails?._id) {
            navigate(`/more_properties_by_seller/${userDetails._id}`);
        }
    };
    // Fetch Property Details
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/api2/getproperty/${id}`);
                setProperty(response.data.property);
            } catch (error) {
                console.error('Error fetching property details:', error);
                toast.error('Failed to fetch property details.');
            } finally {
                setLoading(false);
            }
        };
        fetchPropertyDetails();
    }, [id]);

    // Prediction
    // useEffect(() => {
    //     const fetchPrediction = async () => {
    //         if (!property) return;
            
    //         const payload = {
    //             area: property.area,
    //             bedrooms: property.bedrooms,
    //             parking: property.parking === "without parking" ? 0 : 1,
    //             city: property.city
    //         };
    
    //         console.log("Sending prediction request with payload:", payload);
    
    //         try {              
    //             const response = await axios.post("http://localhost:5000/predict", payload);
    //             console.log("Prediction response:", response.data); 
    //             setPredictedPrice(response.data.predicted_price);

    //         } catch (error) {
    //             console.error("Prediction API error:", error); // You'll see detailed Axios error
    //             toast.error("Failed to fetch predicted price.");
    //         }
    //     };
    
    //     fetchPrediction();
    // }, [property]);
    
     

    // Fetch User Details (Seller Information)
    useEffect(() => {
        if (property?.user) {
            const fetchUserDetails = async () => {
                try {
                    setUserLoading(true);
                    const response = await axios.get(`${BASE_URL}/api/getuser/${property.user}`);
                    setUserDetails(response.data.user);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    toast.error('Failed to fetch user details.');
                    setUserDetails(null);
                } finally {
                    setUserLoading(false);
                }
            };
            fetchUserDetails();
        }
    }, [property]);

    // Fetch Similar Properties
    useEffect(() => {
        if (property) {
            const fetchSimilarProperties = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api2/getallproperties`);
                    const properties = response.data.properties || [];
                    const filteredProperties = properties.filter(
                        (p) => p.city === property.city && p._id !== property._id
                    );
                    setSimilarProperty(filteredProperties.reverse());
                } catch (error) {
                    console.error('Error fetching similar properties:', error);
                    toast.error('An error occurred while fetching properties.');
                }
            };
            fetchSimilarProperties();
        }
    }, [property]);

    // Fetch Nearby Services
    useEffect(() => {
        if (!property) return;
        const fetchUserServices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/api3/getallservices`);
                const allServices = response.data.services || [];
                const filteredServices = allServices.filter(
                    (service) => service.pincode === property.pincode
                );
                setServices(filteredServices);
            } catch (error) {
                console.error("Error fetching services:", error.response?.data || error.message);
                toast.error("Error fetching services.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserServices();
    }, [property]);

    // Show Loading Spinner While Fetching Data
    if (loading) {
        return (
            <div className="property-details-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    // Show Message If Property Not Found
    if (!property) return <p className="property-details-notfound">Property not found.</p>;

    // Process Property Image URL
//     const newImg = !property.img
//   ? "https://i.postimg.cc/gjDVDzCq/Screenshot-2025-04-23-164006.png"
//   : property.img.startsWith("http")
//     ? property.img
//     : `${BASE_URL}${property.img}`;

    const defaultImage = "https://i.postimg.cc/gjDVDzCq/Screenshot-2025-04-23-164006.png";

// Logic to determine the image source
  const newImg = property.img && property.img.trim() !== ""
  ? property.img.startsWith("http://localhost:4004/uploads")
    ? property.img
    : property.img.startsWith("/uploads")
      ? `http://localhost:4004${property.img}`
      : property.img.startsWith("http://localhost:4004")
        ? property.img.replace("http://localhost:4004", "")
        : property.img.startsWith("http://") || property.img.startsWith("https://") //  NEW case for external URLs
          ? property.img
          : `http://localhost:4004/${property.img}` // fallback for other relative paths
  : defaultImage;
    return (
        <div className="property-details-page">
            <ToastContainer />

            {/* Property Details Section */}
            <div className="property-details-card">
                <div className="property-details-card-left">
                    <img src={newImg} alt="Property" className="property-details-img" loading='lazy' />

                    <div className="property-details-info">
                        <h2 className="property-details-title">{property.title}</h2>
                        <p className="property-details-description">{property.description}</p>

                        {/* Property Specifications */}
                        <div className="property-details-item">
                            <div className="property-details-item-left">
                                <p><strong>Status:</strong> For {property.status}</p>
                                <p><strong>Price:</strong> Rs {property.price ? property.price : "Loading..."}</p>
                                        {predictedPrice !== null||predictedPrice==0 ? (
                                        <p><strong>Predicted Price (AI):</strong> Rs {predictedPrice??"Loading..."}</p>
                                        ) : (
                                        <p><strong>Predicted Price (AI):</strong> Loading...</p>
                                        )}                            

                                <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                                <p><strong>Parking:</strong> {property.parking}</p>
                            </div>
                            <div className="property-details-item-right">
                                <p><strong>Area:</strong> {property.area} sq.ft</p>
                                <p><strong>Address:</strong> {property.address}, {property.city}, {property.pincode}, {property.country}.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map and Seller Details Section */}
                <div className="property-details-card-right">
                    {/* Map Section */}
                    <div className="map-container">
                        {loading ? <div className="spinner"></div> : (
                            <Map
                                address={property.address}
                                pincode={property.pincode}
                                city={property.city}
                                country={property.country}

                            />
                        )}
                    </div>

                    {/* Seller Contact Details */}
                    {userLoading ? (
                        <div className="seller-details-loading">
                            <div className="spinner"></div>
                        </div>
                    ) : userDetails ? (
                        <div className="seller-details">
                            <h3>Contact</h3>
                            <div className="detail"
                                onClick={handleUserDetailAndProperties}>
                                <img className="user-image" src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png" alt="user" />
                                <p>{userDetails.username}</p>
                            </div>
                            <div className="detail"><IoMdMail className="icon" /><p>{userDetails.email}</p></div>
                            <div className="detail"><PiPhoneCallFill className="icon" /><p>{userDetails.phonenumber}</p></div>
                            <a href={`https://wa.me/${userDetails.phonenumber}`} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                                <IoLogoWhatsapp className="icon" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    ) : (
                        <h2 className="seller-details-error-message">No seller for this property!!</h2>
                    )}
                </div>
            </div>

            {/* Nearby Services */}
            <div className="similar-property-container">
                <h1>Available Services</h1>
                <div className="service-list-in-detailpage">
                    {services.length > 0 ? services.map((service) => (
                        <ServiceCard key={service._id} {...service} />
                    )) : <p>No services nearby.</p>}
                </div>
            </div>

            {/* Similar Properties */}
            <div className="similar-property-container">
                <h1>More properties in {property.city}</h1>
                <div className="similar-property-list">
                    {similarProperty.length > 0 ? similarProperty.map((property) => (
                        <Propertycard key={property._id}
                            id={property._id} {...property} />
                    )) : <p>No properties found in {property.city}.</p>}
                </div>
                <button onClick={navigateToListing} className="view_more_btn">View More</button>
            </div>
        </div>
    );
};

export default PropertyDetails;
