import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import AlertErrorNoAuth from '../components/Alerts/AlertErrorNoAuth';

const Navbar = lazy(() => import('../components/Navbar/Navbar'));

const AppLayout = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  const urlCheckPermission = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/checkPermission`;

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Navbar />
      {showErrorMessage && <AlertErrorNoAuth errorMessage={errorMessage} />}
      <main>
        <Outlet />
      </main>
    </Suspense>
  );
};

export default AppLayout;
