import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

const HeaderButtons = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();


  const handleMyProfile = () =>{
    navigate('profile', { state: { value_user: "aa" }})
  }
  return (
    <div className="navbar__header-redirects">
      <button className="button__navbar" onClick={handleMyProfile}>
        Mi perfil
      </button>
      <button className="button__navbar" to="#">
        Mensajes
      </button>
    </div>
  );
};

export default HeaderButtons;
