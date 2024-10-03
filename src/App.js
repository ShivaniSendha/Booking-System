// src/App.js
import React from 'react';
import Signup from './Component/User/SignUp';
import Login from './Component/User/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddEventForm from './Component/AddEvent';
import CalendarComponent from './Component/Calender';
import Profile from './Component/Profile';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    
    <div>
       <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-event" element={<AddEventForm />} />
          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/profile" element={<Profile/>} />
                
                
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
