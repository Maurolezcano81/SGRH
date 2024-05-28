import React, { useState } from 'react';
import ButtonBlue from '../../components/ButtonBlue';
import ButtonRed from '../../components/ButtonRed';

const ModalAdd = ({
  title_modal,
  labels,
  placeholders,
  fetchData,
  method,
  urlCreate,
  onSubmitCreate,
  handleModalAdd,
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
    });
  };

  // Método para manejar el envío del formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newData = fetchData.reduce((acc, key, index) => {
      acc[key] = inputValues[key] || '';
      return acc;
    }, {});

    try {
      const response = await fetch(urlCreate, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      const dataFormatted = await response.json();

      if (response.status === 403) {
        setErrorMessage(dataFormatted.message);
      } else {
        onSubmitCreate(newData);
        handleModalAdd();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="preferences__modal__container">
      <div className="preferences__modal__content">
        <h2>{title_modal}</h2>
        <form>
          {labels.map((label, index) => (
            <div key={index} className="preferences__modal__field">
              <label>{label}</label>
              <input
                type="text"
                name={fetchData[index]}
                placeholder={placeholders[index]}
                value={inputValues[fetchData[index]] || ''}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
          ))}
        </form>
        {errorMessage && (
          <div className="preferences__modal__error">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="preferences__modal__actions">
          <ButtonRed title="Cancelar" onClick={handleModalAdd} />

          <ButtonBlue title="Guardar Cambios" onClick={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ModalAdd;
