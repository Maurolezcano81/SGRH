import { useState } from 'react';

const ModalAddTwoInputs = ({ labels, placeholders, fetchData, method, urlCreate, onSubmitCreate, handleModalAdd }) => {
  const [firstData, setFirstData] = useState('');
  const [secondData, setSecondData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFirstData = (e) => {
    setFirstData(e.target.value);
  };

  const handleSecondData = (e) => {
    setSecondData(e.target.value);
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const newData = {
      [fetchData[0]]: firstData,
      [fetchData[1]]: secondData,
    };

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
        return setErrorMessage(dataFormatted.message);
      }
      onSubmitCreate(newData); // Pasa los datos al componente principal
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="preferences__modal__container">
      <div className="preferences__modal__content">
        <h2>Agregar Nuevo</h2>
        <form onSubmit={handleForm}>
          <div className="preferences__modal__field">
            <label>{labels[0]}</label>
            <input type="text" placeholder={placeholders[0]} value={firstData} onChange={handleFirstData} />
          </div>
          <div className="preferences__modal__field">
            <label>{labels[1]}</label>
            <input type="text" placeholder={placeholders[1]} value={secondData} onChange={handleSecondData} />
          </div>
          <div className="preferences__modal__actions">
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleModalAdd}>
              Cancelar
            </button>
          </div>
          <div className="preferences__modal__actions-error">
            <p>{errorMessage}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddTwoInputs;
