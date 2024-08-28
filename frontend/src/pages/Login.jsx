import User from '../assets/Icons/Login/User.png';
import Invisible from '../assets/Icons/Login/Invisible.png';
import Enterprise from '../assets/Enterprise.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import ErrorMessage from '../components/Alerts/ErrorMessage';
import SuccessfullyMessage from '../components/Alerts/SuccessfullyMessage';
const Login = () => {
  const urlApi = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.END_LOGIN}`;

  const [error, setError] = useState(null);
  const [successfullyMessage, setSuccessfullyMessage] = useState(null);

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');

  const Navigate = useNavigate();
  const { storageAuthData } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const userData = JSON.parse(storedToken);
        switch (userData.name_profile) {
          case 'Administrador':
            Navigate('/admin/inicio');
            break;
          case 'RRHH':
            Navigate('/rrhh/inicio');
            break;
            case 'Personal':
              Navigate('/personal/inicio');
              break;
        }
      } catch (error) {
        console.error('Error al iniciar sesión automáticamente:', error);
        Navigate('/');
      }
    }
  }, [Navigate]);

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };

  const changePwd = (e) => {
    setPwd(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(urlApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          pwd_user: pwd,
        }),
      });

      const fetchData = await response.json();

      if (response.status != 200) {
        setError(fetchData.message);
        return;
      }

      setError(null);
      setSuccessfullyMessage(fetchData.message);
      storageAuthData(fetchData.userData);
      localStorage.setItem('token', JSON.stringify(fetchData.userData));

      setTimeout(() => {
        Navigate(fetchData.userData.home_page);
      }, 1000);
    } catch (e) {
      console.error(e.name);
    }
  };

  return (
    <div className="login__container">
      <div className="login__content">
        <div className="login-title">
          <h2>INICIAR SESIÓN</h2>
        </div>
        <div className="login__form__container">
          <div className="login__form__content">
            <div className="login__form-img">
              <img src={Enterprise} alt="" />
            </div>
            <form action="/" onSubmit={handleSubmit} className="login__form">
              <div className="login__input-container">
                <label>Nombre de usuario o email</label>
                <div className="login-input">
                  <input type="text" onChange={changeUsername} />
                  <img src={User} alt="Icono de Usuario" />
                </div>
              </div>
              <div className="login__input-container">
                <label>Clave</label>
                <div className="login-input">
                  <input type="password" onChange={changePwd} />
                  <img src={Invisible} alt="Icono de Usuario" />
                </div>
              </div>

              {error && <ErrorMessage error={error} />}
              {successfullyMessage && <SuccessfullyMessage message={successfullyMessage} />}

              <div className="login__button">
                <button onTouchEnd={handleSubmit} type="submit">
                  INICIAR
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
