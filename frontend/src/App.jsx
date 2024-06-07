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
import Country from './pages/Admin/System/Country';
import Nacionality from './pages/Admin/System/Nacionality';
import { NavbarProvider } from './contexts/NavbarProvider';
import StatusRequest from './pages/Admin/System/StatusRequest';
import Module from './pages/Admin/System/Module';
import TypeTermination from './pages/Admin/System/TypeOfTermination';
import Department from './pages/Admin/System/Department';
import Document from './pages/Admin/System/Document';
import CreateUser from './pages/Admin/User/CreateUserLayout';
import Subject from './pages/Admin/System/Subject';
import Attachment from './pages/Admin/System/Attachment';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavbarProvider>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="ajustes/*" element={<Preferences />}>
                <Route path="ocupacion" element={<Occupation />} />
                <Route path="sexo" element={<Sex />} />
                <Route path="contacto" element={<Contact />} />
                <Route path="pais" element={<Country />} />
                <Route path="nacionalidad" element={<Nacionality />} />
                <Route path="estado_de_solicitud" element={<StatusRequest />} />
                <Route path="modulo" element={<Module />} />
                <Route path="tipo_de_renuncia" element={<TypeTermination />} />
                <Route path="documento" element={<Document />} />
                <Route path="departamento" element={<Department />} />
                <Route path="tipo_asunto_mensaje" element={<Subject />} />
                <Route path="tipo_anexo" element={<Attachment />} />
              </Route>
              <Route path="usuarios/crear" element={<CreateUser />} />
            </Route>
          </Routes>
        </NavbarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
