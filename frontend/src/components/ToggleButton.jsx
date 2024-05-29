import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import AlertSuccesfully from './Alerts/AlertSuccesfully';
import ErrorMessage from './Alerts/ErrorMessage';

const ToggleButton = ({ fetchUrl, status_value, handleDependencyToggle, status_name, idToToggle, item }) => {
  const { authData } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    const updatedStatus = item[status_name[1]] === 1 ? 0 : 1;
    const body = {
      [status_name[0]]: idToToggle,
      [status_name[1]]: updatedStatus,
    };

    try {
      const fetchResponse = await fetch(fetchUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await fetchResponse.json();

      if (!fetchResponse.ok) {
        setErrorMessage(data.message);
        return;
      }

      handleDependencyToggle();

      setSuccessMessage(data.message);

      setTimeout(() => {
        setSuccessMessage('');
      }, 800);
    } catch (error) {
      console.log('Error al actualizar el estado', error);
      setErrorMessage('Error al actualizar el estado');
    }
  };

  return (
    <div>
      {successMessage && <AlertSuccesfully message={successMessage} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className="toggle-container" onClick={handleSubmit}>
        <div className={`toggle-circle ${status_value ? 'active' : ''}`}></div>
      </div>
    </div>
  );
};

export default ToggleButton;
