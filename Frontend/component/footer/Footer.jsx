import React from 'react';
import "./Footer.css";

const Footer = () => {
    return (
        <div className='footer-container'>
            <div className="footer_left">
                <h2 className='logo_footer'>Foresight <span>realty </span> </h2>
                <span className="secondaryText">
                    Our vision is to make all people <br />
                    the best place to live for them.
                </span>
            </div>
            <div className="footer_right">
                <span className="primaryText">Information</span>
                <br />
                <span className="secondaryText">145 Miar Road, INDIA</span>
                <div className="services_footer">
                    <span>Property</span>
                    <span>Services</span>
                    <span>Product</span>
                    <span>About Us</span>
                </div>
            </div>
        </div>
    );
}

export default Footer;
