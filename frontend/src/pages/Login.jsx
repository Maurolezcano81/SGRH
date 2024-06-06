import User from '../assets/Icons/Login/User.png';
import Invisible from '../assets/Icons/Login/Invisible.png';
import Enterprise from '../assets/Enterprise.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import ErrorMessage from '../components/Alerts/ErrorMessage';
import SuccessfullyMessage from '../components/Alerts/SuccessfullyMessage';
const Login = () => {
  const urlApi = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/login`;

  const [error, setError] = useState(null);
  const [successfullyMessage, setSuccessfullyMessage] = useState(null);

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [keepSession, setKeepSession] = useState(false);

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
          case 'Personal':
            Navigate('/personal/inicio');
            break;
          default:
            Navigate('/admin/inicio');
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

  const changeKeepSesion = (e) => {
    setKeepSession(e.target.checked);
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
          pwd: pwd,
        }),
      });

      const fetchData = await response.json();

      if (response.status === 403) {
        setError(fetchData.message);
        return;
      }

      setError(null);
      setSuccessfullyMessage(fetchData.message);
      storageAuthData(fetchData.userData);
      if (keepSession) {
        localStorage.setItem('token', JSON.stringify(fetchData.userData));
      }
      setTimeout(() => {
        switch (fetchData.userData.name_profile) {
          case 'Administrador':
            Navigate('/admin/inicio');
            break;
          case 'Personal':
            Navigate('/personal/inicio');
            break;
        }
        Navigate('/admin/inicio');
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

              <div className="login__input-checkbox">
                <input type="checkbox" onChange={changeKeepSesion} />
                <p>Mantener sesión iniciada</p>
              </div>

              {error && <ErrorMessage error={error} />}
              {successfullyMessage && <SuccessfullyMessage message={successfullyMessage} />}

              <div className="login__button">
                <button onTouchEnd={handleSubmit} type="submit">
                  INICIAR
                </button>
              </div>

              <div className="login__forgot">
                <Link href="#">¿Olvidates tu contraseña? Haz clic aquí.</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
