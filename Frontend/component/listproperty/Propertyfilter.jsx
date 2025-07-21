import React, { useEffect, useState } from 'react';
import './Propertyfilter.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Propertycard from '../propertycard/Propertycard';
import axios from 'axios';

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
  UAE: [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al-Quwain', 'Fujairah', 'Ras Al Khaimah'
  ],
  Other: []
};

const Propertyform = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    country: '',
    state: '', // Added state
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    parking: '',
  });

  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:4004/api2/getallproperties');
        const properties = response.data.properties || [];
        setProperties(properties.reverse());
        setFilteredProperties(properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('An error occurred while fetching properties.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 760);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const results = properties.filter((property) => {
      const countryMatch =
        filter.country === '' || property.country?.toLowerCase() === filter.country.toLowerCase();
      const stateMatch =
        filter.state === '' || property.state?.toLowerCase() === filter.state.toLowerCase();
      const cityMatch =
        filter.city === '' || property.city?.toLowerCase().includes(filter.city.toLowerCase());
      const typeMatch =
        filter.type === '' || property.status?.toLowerCase() === filter.type.toLowerCase();
      const minPriceMatch =
        filter.minPrice === '' || Number(property.price) >= Number(filter.minPrice);
      const maxPriceMatch =
        filter.maxPrice === '' || Number(property.price) <= Number(filter.maxPrice);
      const bedroomsMatch =
        filter.bedrooms === '' || Number(property.bedrooms) === Number(filter.bedrooms);
      const parkingMatch =
        filter.parking === '' || property.parking?.toLowerCase() === filter.parking.toLowerCase();

      return (
        countryMatch &&
        stateMatch &&
        cityMatch &&
        typeMatch &&
        minPriceMatch &&
        maxPriceMatch &&
        bedroomsMatch &&
        parkingMatch
      );
    });

    setFilteredProperties(results);
    setIsLeftVisible(false);
  };

  const toggleLeftSection = () => {
    setIsLeftVisible((prev) => !prev);
  };

  // Get states based on selected country
  const getStatesForCountry = (country) => {
    return countryStatesMap[country] || [];
  };

  return (
    <div className="property-container">
      <ToastContainer />
      <h1>Find Your Perfect Property Today</h1>
      <div className="property-display-container">
        {isMobileView && (
          <button className="toggle_btn" onClick={toggleLeftSection}>
            Filter
          </button>
        )}

        {/* Filter Section */}
        <div className={`left ${isLeftVisible && isMobileView ? 'show' : ''}`}>
          <div className="welcome">
            <h3>Find by</h3>
          </div>

          <div className="property-length">
            Number of Properties: <span>{filteredProperties.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="filters">
            <div className="filter-item">
              <label htmlFor="country">Country :</label>
              <select name="country" id="country" value={filter.country} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="India">India</option>
                <option value="Australia">Australia</option>
                <option value="UAE">UAE</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="state">State/Province :</label>
              <select name="state" id="state" value={filter.state} onChange={handleFilterChange} disabled={!filter.country}>
                <option value="">All</option>
                {getStatesForCountry(filter.country).map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="city">City :</label>
              <input
                type="text"
                id="city"
                name="city"
                value={filter.city}
                onChange={handleFilterChange}
                placeholder="Enter city"
              />
            </div>

            <div className="filter-item">
              <label htmlFor="type">Type :</label>
              <select name="type" id="type" value={filter.type} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="bedrooms">No. of Bedrooms :</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={filter.bedrooms}
                onChange={handleFilterChange}
                placeholder="0"
                max="8"
              />
            </div>

            <div className="filter-item">
              <label htmlFor="parking">Parking :</label>
              <select name="parking" id="parking" value={filter.parking} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="without parking">Without Parking</option>
                <option value="with parking">With Parking</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="minPrice">Min Price :</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filter.minPrice}
                onChange={handleFilterChange}
                placeholder="Min price"
              />
            </div>

            <div className="filter-item">
              <label htmlFor="maxPrice">Max Price :</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filter.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max price"
              />
            </div>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Properties Section */}
        <div className="right">
          {isLoading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : (
            <div className="card-container">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <Propertycard
                    key={property._id || index}
                    id={property._id}
                    title={property.title}
                    description={property.description}
                    address={property.address}
                    city={property.city}
                    country={property.country}
                    state={property.state} 
                    status={property.status}
                    price={property.price}
                    img={property.img}
                    bedroom={property.bedrooms}
                  />
                ))
              ) : (
                <p>No properties found matching the filters.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Propertyform;
