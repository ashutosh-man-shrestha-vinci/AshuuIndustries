import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import AdminRoute from './components/AdminRoute'; // mot de passe simple

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page client : juste le formulaire */}
        <Route path="/" element={<ReservationForm />} />

        {/* Page admin : liste des réservations avec protection */}
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
