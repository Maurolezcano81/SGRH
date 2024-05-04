import Navbar from "../components/Navbar/Navbar"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from "../components/ErrorMessage"
import useAuth from "../hooks/useAuth"

const AdminDashboard = () => {
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
        </>
    )
}

export default AdminDashboard
