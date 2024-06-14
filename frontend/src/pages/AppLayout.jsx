import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import AlertErrorNoAuth from '../components/Alerts/AlertErrorNoAuth';
import InformattionMessage from '../components/Modals/InformattionMessage';

const Navbar = lazy(() => import('../components/Navbar/Navbar'));

const AppLayout = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [showPwdChangedModal, setShowPwdChangedModal] = useState(false); // Estado para controlar el modal específico

  const urlCheckPermission = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/checkPermission`;
  const urlCheckHasToPwdChanged = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/haspwdchanged`;

  const location = useLocation();
  const pathActually = location;
  const storedToken = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const checkTokenAvailability = () => {
      if (authData.token || storedToken) {
        setIsTokenChecked(true);
      } else {
        setShowErrorMessage(true);
        setErrorMessage('Primero debes iniciar sesión');
        setIsLoading(false);
      }
    };

    checkTokenAvailability();
  }, [authData.token, storedToken]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isTokenChecked) return;

      try {
        const token = authData.token || storedToken;
        const fetchResponse = await fetch(urlCheckPermission, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ urlToCheck: pathActually.pathname }),
        });

        const fetchData = await fetchResponse.json();
        if (fetchResponse.status === 500 || fetchResponse.status === 403) {
          setShowErrorMessage(true);
          setErrorMessage(fetchData.message);
          setTimeout(() => {
            navigate('/');
            setShowErrorMessage(false);
          }, 3000);
        } else {
          setShowErrorMessage(false);
          setErrorMessage('');
        }
      } catch (error) {
        setShowErrorMessage(true);
        setErrorMessage('Error al comprobar los permisos');
        setTimeout(() => {
          navigate('/');
          setShowErrorMessage(false);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [authData.token, navigate, pathActually.pathname, storedToken, urlCheckPermission, isTokenChecked]);

  useEffect(() => {
    const checkHasPwdChanged = async () => {

      try {
        const token = authData.token || storedToken;
        console.log(token);
        const fieldResponse = await fetch(urlCheckHasToPwdChanged, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const fieldData = await fieldResponse.json();
        if (fieldData.haspwdchanged) {
          setShowPwdChangedModal(true);
        }
      } catch (error) {
        console.error('Error al comprobar el cambio de contraseña:', error);
      }
    };

    checkHasPwdChanged();
  }, [authData.token]);

  if (isLoading) {
    return <Spinner />;
  }

  const closeModalInformattionMessage = () => {
    setShowPwdChangedModal(false);
  };

  return (
    <Suspense fallback={<Spinner />}>
      <Navbar />
      {showErrorMessage && <AlertErrorNoAuth errorMessage={errorMessage} />}
      {showPwdChangedModal && (
        <InformattionMessage message="You need to change your password." closeModal={closeModalInformattionMessage} />
      )}
        {/* FALTA AGREGAR BOTON PARA REDIRECCIONAR A PAGINA */}

      <main>
        <Outlet />
      </main>
    </Suspense>
  );
};

export default AppLayout;
