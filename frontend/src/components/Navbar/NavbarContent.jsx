import {
    Link
} from 'react-router-dom';

import {
    useState
} from 'react';

import useAuth from '../../hooks/useAuth';
import AdminOptions from './AdminOptions';

const NavbarContent = () => {
    const { authData } = useAuth();

    return (
        <div className="navbar__content">
            
            {authData?.name_profile && authData?.name_profile === "Administrador" ? <AdminOptions /> : null}

        </div>
    )
}

export default NavbarContent;