import React from 'react';
import './ServiceCard.css';

// Icons
import { PiPhoneCallFill } from "react-icons/pi";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

const ServiceCard = ({ fullName, shopName, address, city, country, pincode, contactNumber, profession }) => {

  // WhatsApp link generation (only if contact number exists)
  const getWhatsappLink = (contactNumber) => {
    return contactNumber ? `https://wa.me/${contactNumber}` : null;
  };

  return (
    <div className="service-card">
      <p className="profession">{profession}</p>
      <div className="name_img">
        <img className='user_img' src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png" alt="" />
        <h3 className="full-name">{fullName}</h3>
      </div>
      <h4 className="shop-name">{shopName}</h4>
      <div className="address"><FaLocationDot className="icon"/>
      {address}, {city}, {country}, {pincode}</div>
      <div className='phone_no'>
        <PiPhoneCallFill className="icon" />
        {contactNumber}
      </div>

      {/* If contact number exists, display WhatsApp link */}
      {contactNumber ? (
        <a href={getWhatsappLink(contactNumber)} target="_blank" rel="noopener noreferrer" className="whatsapp-link-service">
          <IoLogoWhatsapp className="icon" />{contactNumber}
        </a>
      ) : (
        <p><IoLogoWhatsapp className="icon" /> {contactNumber}</p>
      )}
    </div>
  );
};


export default ServiceCard;
