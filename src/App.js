// src/App.js
import React from 'react';
import Signup from './Component/User/SignUp';
import Login from './Component/User/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddEventForm from './Component/AddEvent';
import CalendarComponent from './Component/Calender';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-event" element={<AddEventForm />} />
          <Route path="/calendar" element={<CalendarComponent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
