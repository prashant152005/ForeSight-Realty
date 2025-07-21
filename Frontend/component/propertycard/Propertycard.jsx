import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Propertycard.css';

const Propertycard = ({ id, title, description, address, city, country, price, img, status, bedroom }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    console.log("id", id);
    navigate(`/property/${id}`);
  };

const defaultImage = "https://i.postimg.cc/GtWZRj7m/Screenshot-2025-04-23-163949.png";

// Logic to determine the image source
const imageSrc = img && img.trim() !== ""
  ? img.startsWith("http://localhost:4004/uploads")
    ? img
    : img.startsWith("/uploads")
      ? `http://localhost:4004${img}`
      : img.startsWith("http://localhost:4004")
        ? img.replace("http://localhost:4004", "")
        : img.startsWith("http://") || img.startsWith("https://") //  NEW case for external URLs
          ? img
          : `http://localhost:4004/${img}` // fallback for other relative paths
  : defaultImage;
 
  return (
    <div className='property-card' onClick={handleCardClick}>
      <div className="property-img">
        <img 
          src={imageSrc}
          alt="Property Image"
          loading="lazy"
        />
      </div>
      <div className='property-data'>
        <div className="heading">
          <p className='title'>{title}</p>
          <p className='status'>{status}</p>
        </div>
        <div className='price_and_bedroom'>
          <p className='price'>Rs {price}{status === "sell" ? "" : "/m"}</p>
          <p className='bedroom'>
            Bedrooms : {bedroom}
          </p>
        </div>
        <p className='description'>
          {description.length > 56 ? `${description.slice(0, 50)}...` : description}
        </p>
        <p className='address'>{`${city}, ${country}`}</p>
      </div>
    </div>
  );
};

export default Propertycard;
