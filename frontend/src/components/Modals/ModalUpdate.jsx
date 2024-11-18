import React, { useState, useEffect } from 'react';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import useAuth from '../../hooks/useAuth';
import AlertSuccesfully from '../Alerts/AlertSuccesfully';
import AlertError from '../Alerts/AlertError';

const ModalUpdate = ({
  title_modal,
  labels,
  placeholders,
  fetchData,
  methodGetOne,
  methodUpdateOne,
  updateOneUrl,
  handleModalUpdate,
  getOneUrl,
  onSubmitUpdate,
  idToUpdate,
  idFetchData,
  fetchData_select,
}) => {
  const [inputValues, setInputValues] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { authData } = useAuth();

  useEffect(() => {
    const fetchDataToUpdate = async () => {
      try {
        const requestBody = { [idFetchData]: idToUpdate };

        const fetchResponse = await fetch(getOneUrl, {
          method: methodGetOne,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await fetchResponse.json();

        if (!fetchResponse.ok) {
          setErrorMessage(data.message || 'Error al obtener los datos.');
          return;
        }

        setInputValues(data.queryResponse[0]);
      } catch (error) {
        setErrorMessage('Error en la conexión al servidor.');
      }
    };

    fetchDataToUpdate();
  }, [authData.token, getOneUrl, idToUpdate, idFetchData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(updateOneUrl, {
        method: methodUpdateOne,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(inputValues),
      });

      const dataFormatted = await response.json();

      if (!response.ok) {
        setErrorMessage(dataFormatted.message || 'Error al actualizar los datos.');
        setSuccessMessage('');
        return;
      }

      setSuccessMessage(dataFormatted.message || 'Datos actualizados correctamente.');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
        onSubmitUpdate(inputValues); // Refrescar la lista o realizar acción adicional
        handleModalUpdate(); // Cerrar el modal
      }, 1500);
    } catch (error) {
      setErrorMessage('Error en la conexión al servidor.');
      setSuccessMessage('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  return (
    <>
      {successMessage && <AlertSuccesfully message={successMessage} />}
      {errorMessage && <AlertError errorMessage={errorMessage} />}

      <div className="alert__background__black">
        <div className="preferences__modal__container">
          <div className="preferences__modal__content">
            <h2>{title_modal}</h2>
            <form className="preferences__modal__content-update" onSubmit={handleFormSubmit}>
              {labels.map((label, index) => (
                <div key={index} className="preferences__modal__field">
                  <label>{label}</label>
                  <input
                    type="text"
                    name={fetchData[index]}
                    placeholder={placeholders[index]}
                    value={inputValues[fetchData[index]] || ''}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="preferences__modal__field">
                <label htmlFor={fetchData_select}>Estado</label>
                <select
                  value={inputValues[fetchData_select] || ''}
                  name={fetchData_select}
                  onChange={handleInputChange}
                >
                  <option disabled={true} value="">
                    Seleccione un estado
                  </option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </form>
            <div className="preferences__modal__actions">
              <ButtonRed title="Cancelar" onClick={handleModalUpdate} />
              <ButtonBlue title="Guardar Cambios" onClick={handleFormSubmit} type="submit" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalUpdate;
