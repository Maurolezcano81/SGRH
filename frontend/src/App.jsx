import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';

import Login from './pages/Login';
import AdminLayout from './pages/Admin/AdminPage';
import Contact from './pages/Admin/System/Contact';
import Preferences from './pages/Admin/System/PreferencesLayout';
import Personal from './pages/Admin/System/Occupation';

import Sex from './pages/Admin/System/Sex';
import Occupation from './pages/Admin/System/Occupation';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="ajustes/*" element={<Preferences />}>
              <Route path="ocupacion" element={<Occupation />} />
              <Route path="sexo" element={<Sex />} />
              <Route path="contacto" element={<Contact />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
