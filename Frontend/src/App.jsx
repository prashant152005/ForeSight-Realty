import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../src/store';
import './App.css';
import Navbar from '../component/navbar/Navbar';
import Home from '../component/home/Home';
import Footer from '../component/footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../component/auth/Login';
import Signup from '../component/auth/Signup';
import { ToastContainer } from 'react-toastify';
import Propertyfilter from '../component/listproperty/Propertyfilter';
import AddpropertyForm from '../component/addproperty/AddpropertForm'
import PropertyDetails from '../component/PropertyDetails/PropertyDetails';
import MorePropertiesBySameSeller from '../component/more_properties_by_same_seller/more_properties_by_same_seller';
import AddServicesForm from '../component/addseriviceForm/addServicesForm';




function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const id = sessionStorage.getItem("id")
    if (id) {
      dispatch(authActions.login())
    }
  })
  return (
    <Router>
      <ToastContainer />
      <div className="main-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Propertyfilter" element={<Propertyfilter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listyourproperty" element={<AddpropertyForm />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/addservice" element={<AddServicesForm />} />
          <Route path='more_properties_by_seller/:id'
            element={<MorePropertiesBySameSeller />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
