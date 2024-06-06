import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import useNav from '../../hooks/useNav';

import Profile from './Profile';
import HeaderButtons from './HeaderButtons';
import NavbarContent from './NavbarContent';
import Hamburguer from '../../assets/Icons/Navbar/hamburguer.png';

const Navbar = () => {
  const { authData, deleteAuthData } = useAuth();
  const Navigate = useNavigate();

  const { navbarTitle } = useNav();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogout = () => {
    deleteAuthData();
    localStorage.removeItem('token');
    Navigate('/');
  };

  return (
    <div>
      <div className={`navbar__container-open ${isNavbarOpen ? 'hidden' : ''}`}>
        <div>
          <button onClick={toggleNavbar} className="navbar__collapsed-button">
            <img src={Hamburguer} alt="" />
          </button>
        </div>
        {navbarTitle && (
          <div className="title__navbar">
            <h2>{navbarTitle}</h2>
          </div>
        )}
      </div>
      <div className={`navbar__container ${!isNavbarOpen ? 'hidden' : ''}`}>
        <div className="navbar__header">
          <div className="navbar__header-close">
            <button onClick={toggleNavbar}>X</button>
          </div>
          <Profile
            avatar={authData?.avatar_user}
            name={`${authData?.name_entity} ${authData?.lastname_entity}`}
            occupation={authData?.name_occupation}
          />
          <HeaderButtons username={authData?.username_user} />
        </div>


        <NavbarContent />

        
        <div className="navbar__footer">
          <button onClick={handleLogout} className="button__navbar">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
