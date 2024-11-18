import React, { useState } from 'react';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import authData from '../../hooks/useAuth';
import useAuth from '../../hooks/useAuth';
import AlertSuccesfully from '../Alerts/AlertSuccesfully';
import AlertError from '../Alerts/AlertError';

const ModalAdd = ({
  title_modal,
  labels,
  placeholders,
  fetchData,
  method,
  createOne,
  handleModalAdd,
  handleDependencyAdd,
  extraData = {}
}) => {
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false); // Estado para mensaje de éxito
  const [errorAlertMessage, setErrorAlertMessage] = useState(''); // Estado para mensaje de error

  const { authData } = useAuth();

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
      ...extraData
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newData = {
      ...extraData,
      ...inputValues,
    };

    try {
      const response = await fetch(createOne, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(newData),
      });

      const dataFormatted = await response.json();

      if (response.status === 403 || response.status === 422) {
        setErrorMessage(dataFormatted.message);
        return;
      } else if (response.status === 500) {
        setErrorAlertMessage('Error comunicándose con el servidor, intentelo reiniciando el sitio');
      } else if (response.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
          handleDependencyAdd();
          handleModalAdd();
        }, 1500);
      }
    } catch (error) {
      setErrorAlertMessage('Error comunicándose con el servidor, intentelo reiniciando el sitio');
    }
  };

  return (

    <>
      {successMessage && (
        <AlertSuccesfully message="Registro creado exitosamente" />
      )}

      {errorAlertMessage && (
        <AlertError errorMessage={errorAlertMessage} />
      )}

      <div className="alert__background__black">
        <div className="preferences__modal__container">
          <div className="preferences__modal__content">
            <h2>{title_modal}</h2>
            <form>
              {labels.map((label, index) => (
                <div key={index} className="preferences__modal__field">
                  <label>{label}</label>
                  {fetchData[index] === 'is_obligatory' ? (
                    <select
                      name="is_obligatory"
                      value={inputValues.is_obligatory || ''}
                      onChange={(e) => handleInputChange(e, index)}
                    >
                      <option disabled value="">
                        Seleccione una opción
                      </option>
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={fetchData[index]}
                      placeholder={placeholders[index]}
                      value={inputValues[fetchData[index]] || ''}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  )}
                </div>
              ))}
            </form>
            {errorMessage && (
              <div className="preferences__modal__error error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="preferences__modal__actions">
              <ButtonRed title="Cancelar" onClick={handleModalAdd} />
              <ButtonBlue title="Guardar Cambios" onClick={handleFormSubmit} />
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default ModalAdd;
