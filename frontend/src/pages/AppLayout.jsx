import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import AlertErrorNoAuth from '../components/Alerts/AlertErrorNoAuth';
import Warning from '../components/Alerts/Warning';
import Navbar from '../components/Navbar/Navbar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

const AppLayout = () => {
  const navigate = useNavigate();
  const { authData, storageAuthData } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [showPwdChangedModal, setShowPwdChangedModal] = useState(false);

  const urlCheckPermission = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.END_CANMODULE}`;
  const urlCheckHasToPwdChanged = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.END_CANPWD}`;
  const urlCheckToken = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.CHECK_USER_TOKEN}`;

  const location = useLocation();
  const pathActually = location.pathname;

  const local = JSON.parse(localStorage.getItem('token'));

  const token = local.token;

  useEffect(() => {
    const checkTokenAvailability = async () => {
      if (!token) {
        setShowErrorMessage(true);
        setErrorMessage('Primero debes iniciar sesión');
        setIsLoading(false);
  
        setTimeout(() => {
          navigate('/');
          setShowErrorMessage(false);
        }, 3000);
        return;
      }
  
      setIsTokenChecked(true);
  
      try {
        const response = await fetch(urlCheckToken, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Primero debes iniciar sesión');
        }
  
        const fetchData = await response.json();
        const currentLocalToken = JSON.parse(localStorage.getItem('token'));
  
        if (currentLocalToken.token !== fetchData.queryResponse.token) {
          storageAuthData(fetchData.queryResponse);
          localStorage.setItem('token', JSON.stringify(fetchData.queryResponse));
        }
  
      } catch (error) {
        setShowErrorMessage(true);
        setErrorMessage(error.message || 'Error al verificar el token');
        setIsLoading(false);
      }
    };
  
    checkTokenAvailability();
  }, [token, authData, navigate, storageAuthData, urlCheckToken]);


  useEffect(() => {
    if (!isTokenChecked) return;

    const fetchPermissions = async () => {
      try {
        const fetchResponse = await fetch(urlCheckPermission, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ urlToCheck: pathActually }),
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
  }, [isTokenChecked, pathActually, token]); // Asegúrate de incluir el token y otros valores necesarios en las dependencias.

  useEffect(() => {
    const checkHasPwdChanged = async () => {

      try {
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
  }, [local.profile_fk, urlCheckHasToPwdChanged]);

  if (isLoading) {
    return <Spinner />;
  }

  const closeModalInformattionMessage = () => {
    setShowPwdChangedModal(false);
  };

  const goToChangePwd = () => {
    navigate('/profile', { state: { value_user: authData.id_user, isRedirectToChangePwd: true } });
    setShowPwdChangedModal(false);
  };

  return (
    <Suspense fallback={<Spinner />}>
      <Navbar />
      {showErrorMessage && <AlertErrorNoAuth errorMessage={errorMessage} />}
      {showPwdChangedModal && (
        <Warning
          message="Antes de continuar sugerimos cambiar la contraseña para evitar ingresos indeseados."
          redirectFunction={goToChangePwd}
          skipFunction={closeModalInformattionMessage}
        />
      )}
      <main>
        <Breadcrumbs />
        <Outlet />
      </main>
    </Suspense>
  );
};

export default AppLayout;
