import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Home.css';
import Propertycard from '../propertycard/Propertycard';

const Home = () => {
    const navigate = useNavigate();

    const navigateToListing = () => {
        navigate('/Propertyfilter');
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // State to store properties
    const [properties, setProperties] = useState([]);

    // Fetch properties on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4004/api2/getallproperties`);
                const properties = response.data.properties || [];
                setProperties(properties.reverse()); // Reverse here to display latest first
            } catch (error) {
                console.error("Error fetching properties:", error);
                toast.error("An error occurred while fetching properties.");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="landing-page">
            <div className="white_mark"></div>
            <div className="white_mark_2"></div>
            <div className="white_mark_3"></div>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="left-hero-section">
                    <h1>Find Your Dream Home</h1>
                    <p>Explore the best properties to buy, sell, or rent in your desired location. Find your perfect match, whether you're looking for a cozy apartment or a spacious house. With top-notch services and tailored options, we make it easy for you to settle into your new home with confidence and ease!</p>
                    <button onClick={navigateToListing}>Get Started</button>
                </div>
                <div className="righ-hero-section">
                    <img className='hero-img' src="/hero_img.png" alt="Dream Home" />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
                <div className="left-hero-section">
                    <h1>Why Choose Us?</h1>
                    <p>
                        We are dedicated to making your real estate journey smooth and hassle-free. Our platform provides expert guidance, and personalized support to help you find the perfect home.
                        Whether you're looking to buy, sell, or rent, we ensure transparency, reliability, and access to the best properties in the market.
                        With a trusted network of professionals and advanced search features, we simplify the process, so you can focus on finding a place that truly feels like home.
                    </p>
                </div>
                <div className="righ-hero-section">
                    <img className="hero-img" src="/hero_img2.jpg" alt="Trust & Service" />
                </div>
            </div>


            {/* Buy, Sell, Rent Section */}
            <div className="features-section">
                <div className="feature-card" onClick={navigateToListing}>
                    <img src="./mortgage.png" alt="Buy Property" />
                    <h3>Buy</h3>
                </div>
                <div className="feature-card" onClick={navigateToListing}>
                    <img src="./contract.png" alt="Sell Property" />
                    <h3>Sell</h3>
                </div>
                <div className="feature-card" onClick={navigateToListing}>
                    <img src="./rent.png" alt="Rent Property" />
                    <h3>Rent</h3>
                </div>
            </div>

            <h1>Popular Residencies</h1>
            {/* Properties List */}
            <div className="some_property">
                {properties.length > 0 ? (
                    properties.slice(0, 6).map((property, index) => (
                        <Propertycard
                            key={property._id || index}
                            id={property._id}
                            title={property.title}
                            description={property.description}
                            address={property.address}
                            city={property.city}
                            country={property.country}
                            status={property.status}
                            price={property.price}
                            img={property.img || 'https://i.postimg.cc/GtWZRj7m/Screenshot-2025-04-23-163949.png'}
                            bedroom={property.bedrooms}
                        />
                    ))
                ) : (
                    <p>No properties available.</p>
                )}
            </div>
            <button onClick={navigateToListing} className='view_more_btn'>View More</button>
        </div>
    );
};

export default Home;
