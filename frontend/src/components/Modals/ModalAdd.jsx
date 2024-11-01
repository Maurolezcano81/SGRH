import React, { useState } from 'react';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import authData from '../../hooks/useAuth';
import useAuth from '../../hooks/useAuth';

const ModalAdd = ({
  title_modal,
  labels,
  placeholders,
  fetchData,
  method,
  createOne,
  handleModalAdd,
  handleDependencyAdd,
  extraData={}
}) => {
  // Estado para almacenar los valores de los inputs de manera dinámica
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Método genérico para manejar cambios en los inputs
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
      ...extraData
    });
  };

  const { authData } = useAuth();

  // Método para manejar el envío del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newData = {
      ...extraData, 
      ...inputValues, 
  };


  // ACA HICE ESTE CAMBIO: suplante newData
  /* const newData = fetchData.reduce((acc, key, index) => {
    acc[key] = inputValues[key] || '';
    return acc;
  }, {}); */

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

      if (response.status === 403) {
        setErrorMessage(dataFormatted.message);
      } else {
        handleDependencyAdd();
        handleModalAdd();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
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
  );
};

export default ModalAdd;
