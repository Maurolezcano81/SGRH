import Navbar from "../../components/Navbar/Navbar"
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ErrorMessage from "../../components/Alerts/ErrorMessage"
import useAuth from "../../hooks/useAuth"

const AdminLayout = () => {
    const Navigate = useNavigate();
    const { authData } = useAuth();
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken && Object.keys(authData).length === 0) {
            setShowErrorMessage(true);
            setTimeout(() => {
                Navigate('/login');
            }, 3000);
        }
    }, [authData, Navigate]);

    return (
        <>
            <Navbar/>
            {showErrorMessage && <ErrorMessage errorMessage="Primero debes iniciar sesión" />}
            <main>
                <Outlet/>
            </main>
        </>
    )
}

export default AdminLayout
