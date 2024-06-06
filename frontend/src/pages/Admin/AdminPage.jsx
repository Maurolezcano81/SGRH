import Navbar from "../../components/Navbar/Navbar"
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from "../../hooks/useAuth"
import AlertErrorNoAuth from "../../components/Alerts/AlertErrorNoAuth"

const AdminLayout = () => {
    const Navigate = useNavigate();
    const { authData } = useAuth();
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken && Object.keys(authData).length === 0) {
            setShowErrorMessage(true);
            setTimeout(() => {
                Navigate('/');
            }, 3000);
        }
    }, [authData, Navigate]);

    return (
        <>
            <Navbar/>
            {showErrorMessage && <AlertErrorNoAuth errorMessage="Primero debes iniciar sesión" />}
            <main>
                <Outlet/>
            </main>
        </>
    )
}

export default AdminLayout
