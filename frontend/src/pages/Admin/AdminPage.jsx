import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AlertErrorNoAuth from '../../components/Alerts/AlertErrorNoAuth';
import Spinner from '../../components/Spinner';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const urlCheckPermission = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/checkPermission`;

  const location = useLocation();
  const pathActually = location;
  const storedToken = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = authData.token || storedToken;
        if (!token) {
          setShowErrorMessage(true);
          setErrorMessage('Primero debes iniciar sesión');
          setIsLoading(false);
          return;
        }

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

    if (authData.token || storedToken) {
      fetchPermissions();
    } else {
      setIsLoading(false);
    }
  }, [authData.token, navigate, pathActually.pathname, storedToken, urlCheckPermission]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar />
      {showErrorMessage && <AlertErrorNoAuth errorMessage={errorMessage} />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
