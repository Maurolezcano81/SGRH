import {
    useState,
} from 'react';

import {
    Link
} from 'react-router-dom'

import useAuth from '../../hooks/useAuth';


import Profile from './Profile';
import HeaderButtons from './HeaderButtons';
import NavbarContent from './NavbarContent';

const Navbar = () => {
    const { authData } = useAuth();
    return (
        <div className="navbar__container">
            <div className="navbar__header">
                <div className="navbar__header-close">
                    <button>X</button>
                </div>
                <Profile
                    avatar={authData.avatar_user}
                    name={`${authData.name_entity} ${authData.lastname_entity}`}
                    occupation={authData.name_occupation}
                />
                <HeaderButtons
                    username={authData.username_user}
                />
            </div>
            <NavbarContent/>
            <div className="navbar__footer">
                <button className='button__navbar'>Cerrar Sesión</button>
            </div>
        </div>
    )
}

export default Navbar;