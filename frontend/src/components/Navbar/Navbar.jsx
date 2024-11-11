import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useNav from '../../hooks/useNav';
import Profile from './Profile';
import HeaderButtons from './HeaderButtons';
import NavbarContent from './NavbarContent';
import Hamburguer from '../../assets/Icons/Navbar/hamburguer.png';
import BackButton from '../Buttons/BackButton';
import ForwardButton from '../Buttons/ForwardButton';

const Navbar = () => {
  const { authData, deleteAuthData } = useAuth();
  const navigate = useNavigate();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    deleteAuthData();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='sticky'>
      <div className={`navbar__container-open`}>
        <div>
          <button onClick={toggleNavbar} className="navbar__collapsed-button">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3.5rem"
              height="3.5rem"
              viewBox="0 0 32 32">
              <path fill="currentColor" d="M2 6a1 1 0 0 1 1-1h26a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1m0 10a1 1 0 0 1 1-1h26a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1m1 9a1 1 0 1 0 0 2h26a1 1 0 1 0 0-2z" />
            </svg>




          </button>
        </div>

        <div className='buttons__nav__container'>
          <BackButton />
          <ForwardButton />
        </div>
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
          <HeaderButtons username={authData?.id_user} />
        </div>
        <NavbarContent
          toggleNavbar={toggleNavbar}
        />
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
