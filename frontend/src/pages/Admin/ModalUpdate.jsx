import React, { useState, useEffect } from 'react';
import ButtonBlue from '../../components/ButtonBlue';
import ButtonRed from '../../components/ButtonRed';
import useAuth from '../../hooks/useAuth';
import AlertSuccesfully from '../../components/Alerts/AlertSuccesfully';

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
  const [errorMessage, setErrorMessage] = useState('');

  const { authData } = useAuth();

  useEffect(() => {
    const fetchOccupation = async () => {
      try {
        const requestBody = {};
        requestBody[idFetchData] = idToUpdate;

        const fetchResponse = await fetch(getOneUrl, {
          method: methodGetOne,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify(requestBody), // Convertir el objeto a JSON
        });

        if (!fetchResponse.ok) {
          console.log(fetchResponse.message);
        }

        const data = await fetchResponse.json();

        setInputValues(data.queryResponse[0]);
      } catch (error) {
        console.error('Error al obtener las ocupaciones', error);
      }
    };

    fetchOccupation();
  }, [authData.token, getOneUrl, idToUpdate]);

  // Método para manejar el envío del formulario
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

      console.log(dataFormatted);

      if (response.status === 403) {
        setErrorMessage(dataFormatted.message);
      } else {
        onSubmitUpdate(inputValues);
      }
    } catch (error) {
      console.error('Error:', error);
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
                value={inputValues[fetchData[index]]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <div className="preferences__modal__field">
            <label htmlFor={fetchData_select}>Estado</label>
            <select value={inputValues[fetchData_select]} name={fetchData_select} onChange={handleInputChange}>
              <option disabled={true} value="">
                Seleccione un estado
              </option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </form>
        {errorMessage && (
          <div className="preferences__modal__error">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="preferences__modal__actions">
          <ButtonRed title="Cancelar" onClick={handleModalUpdate} />
          <ButtonBlue title="Guardar Cambios" onClick={handleFormSubmit} type="submit" />
        </div>
      </div>
    </div>
  );
};

export default ModalUpdate;
