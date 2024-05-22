import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';

import Login from './pages/Login';
import AdminLayout from './pages/Admin/AdminPage';
import EmployeePage from './pages/EmployeePage';
import Contact from './pages/Admin/System/Contact';
import Preferences from './pages/Admin/System/Preferences';
import Personal from './pages/Admin/System/Personal';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/*"
            element={
                <AdminLayout />
            }
          >
            <Route path="ajustes" element={<Preferences />} />
            <Route path="personal" element={<Personal />} />
            <Route path="contacto" element={<Contact />} />

          </Route>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
