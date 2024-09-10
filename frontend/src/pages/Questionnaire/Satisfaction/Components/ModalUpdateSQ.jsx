import React, { useState } from 'react';
import ButtonBlue from '../../../../components/ButtonBlue';
import ButtonRed from '../../../../components/ButtonRed';
import useAuth from '../../../../hooks/useAuth';
import AlertSuccesfully from '../../../../components/Alerts/SuccessfullyMessage';

const ModalUpdateQuiz = ({
  title_modal,
  labels,
  placeholders,
  fetchData,
  methodUpdateOne,
  updateOneUrl,
  handleModalUpdate,
  onSubmitUpdate,
  dataQuestion,
}) => {
  const [inputValues, setInputValues] = useState(dataQuestion || {});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { authData } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
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
        setErrorMessage(dataFormatted.message);
      } else {
        setSuccessMessage('Cambios guardados exitosamente.');
        onSubmitUpdate(inputValues);
      }
    } catch (error) {
      setErrorMessage('Error al actualizar: ' + error.message);
    } finally {
      setLoading(false);
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
    <div className="alert__background__black">
      <div className="preferences__modal__container">
        <div className="preferences__modal__content">
          <h2>{title_modal}</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <form className="preferences__modal__content-update" onSubmit={handleFormSubmit}>
                {labels.map((label, index) => (
                  <div key={index} className="preferences__modal__field">
                    <label>{label}</label>
                    {fetchData[index] === 'is_obligatory' ? (
                      <select
                        value={inputValues.is_obligatory || ''}
                        name="is_obligatory"
                        onChange={handleInputChange}
                      >
                        <option disabled value="">
                          Seleccione una opción
                        </option>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                      </select>
                    ) : fetchData[index] === 'start_sq' || fetchData[index] === 'end_sq' ? (
                      <input
                        type="date"
                        name={fetchData[index]}
                        value={inputValues[fetchData[index]] || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <input
                        type="text"
                        name={fetchData[index]}
                        placeholder={placeholders[index]}
                        value={inputValues[fetchData[index]] || ''}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                ))}
              </form>
              {errorMessage && (
                <div className="preferences__modal__error">
                  <p>{errorMessage}</p>
                </div>
              )}
              {successMessage && (
                <AlertSuccesfully message={successMessage} />
              )}
              <div className="preferences__modal__actions">
                <ButtonRed title="Cancelar" onClick={handleModalUpdate} />
                <ButtonBlue title="Guardar Cambios" onClick={handleFormSubmit} type="submit" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateQuiz;
