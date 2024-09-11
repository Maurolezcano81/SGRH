import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import Login from './pages/Login/Login';
import AppLayout from './pages/AppLayout';
import HomeAdmin from './pages/Homes/HomeAdmin';
import Profiles from './pages/MasterTables/Profiles';
import HomeRRHH from './pages/Homes/HomeRRHH';
import CreateUser from './pages/User/CreateUser/CreateUserLayout';
import Preferences from './pages/MasterTables/PreferencesLayout';
import Occupation from './pages/MasterTables/Occupation';
import Sex from './pages/MasterTables/Sex';
import Contact from './pages/MasterTables/Contact';
import Country from './pages/MasterTables/Country';
import Nacionality from './pages/MasterTables/Nacionality';
import StatusRequest from './pages/MasterTables/StatusRequest';
import Module from './pages/MasterTables/Module';
import TypeTermination from './pages/MasterTables/TypeOfTermination';
import Document from './pages/MasterTables/Document';
import Department from './pages/MasterTables/Department';
import Subject from './pages/MasterTables/Subject';
import Attachment from './pages/MasterTables/Attachment';
import HomePersonal from './pages/Homes/HomePersonal';
import Profile from './pages/User/Profile/Profile';
import { NavbarProvider } from './contexts/NavbarProvider';
import ListUsers from './pages/User/ListUsers/ListUsers';
import ListDepartments from './pages/Departments/ListDepartments';
import DepartmentView from './pages/Departments/Department/DepartmentView';
import CreateSatisfaction from './pages/Questionnaire/Satisfaction/CreateSatisfaction';
import ListSatisfaction from './pages/Questionnaire/Satisfaction/ListSatisfaction';
import SingleQuiz from './pages/Questionnaire/Satisfaction/SingleQuiz';
import ListPerformance from './pages/Questionnaire/Performance/ListPerformance';
import SingleQuizPerformance from './pages/Questionnaire/Performance/SingleQuizPerformance';
import CreatePerformance from './pages/Questionnaire/Performance/CreatePerformance';
import PersonalCapacitation from './pages/RequestCapacitation/Personal/PersonalCapacitation';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavbarProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              {/* Ruta para Admin */}
              <Route path="admin/*">
                <Route path="inicio" element={<HomeAdmin />} />
                <Route path="perfiles" element={<Profiles />} />
              </Route>
              {/* Home del admin */}
              {/* Ruta para RRHH */}
              <Route path="rrhh/*">
                <Route path="inicio" element={<HomeRRHH />} />
                <Route path='personal/*'>
                  <Route path="crear" element={<CreateUser />} />
                  <Route path="ver" element={<ListUsers />} />
                </Route>
                <Route path='departamentos/*'>
                  <Route path="ver/*">
                    <Route path="" element={<ListDepartments />} />
                    <Route path="departamento" element={<DepartmentView />} />
                  </Route>
                </Route>
                <Route path='satisfaccion/*'>
                  <Route path='cuestionarios' element={<ListSatisfaction />} />
                  <Route path='ampliar' element={<SingleQuiz />} />
                  <Route path='crear' element={<CreateSatisfaction />} />
                </Route>
                <Route path='rendimiento/*'>
                  <Route path='cuestionarios' element={<ListPerformance />} />
                  <Route path='ampliar' element={<SingleQuizPerformance />} />
                  <Route path='crear' element={<CreatePerformance />} />
                </Route>
                <Route path="ajustes/*" element={<Preferences />}>
                  <Route path="ocupacion" element={<Occupation />} />
                  <Route path="sexo" element={<Sex />} />
                  <Route path="contacto" element={<Contact />} />
                  <Route path="pais" element={<Country />} />
                  <Route path="nacionalidad" element={<Nacionality />} />
                  <Route path="tipo_estado_solicitud" element={<StatusRequest />} />
                  <Route path="modulo" element={<Module />} />
                  <Route path="tipo_renuncia" element={<TypeTermination />} />
                  <Route path="documento" element={<Document />} />
                  <Route path="departamento" element={<Department />} />
                  <Route path="tipo_asunto_mensaje" element={<Subject />} />
                  <Route path="tipo_anexo" element={<Attachment />} />
                </Route>
              </Route>

              <Route path="personal/*">
                <Route path="inicio" element={<HomePersonal />} /> {/* Home del admin */}
                <Route path="solicitud/*"> 
                <Route path="capacitacion" element={<PersonalCapacitation/>}>
                </Route> 
                
                </Route> {/* Home del admin */}
              </Route>


              <Route path="profile/" element={<Profile />} />

            </Route>
          </Routes>
        </NavbarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
