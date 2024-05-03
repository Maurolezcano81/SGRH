import React from "react"

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import {
  AuthProvider
} from "./contexts/AuthProvider"


import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminPage"
import EmployeePage from "./pages/EmployeePage"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/admin/inicio"
            element={<AdminDashboard />}
          />

          <Route
          path="/personal/inicio"
          element={<EmployeePage />}
          />
        </Routes>
      </AuthProvider>


    </BrowserRouter>
  )
}

export default App
