import { useState } from 'react';
import ErrorMessage from '../Alerts/ErrorMessage';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import useAuth from '../../hooks/useAuth';
const ModalDelete = ({
  handleModalDelete,
  deleteOne,
  field_name,
  idToDelete,
  onSubmitDelete,
  messageToDelete = "¿Quieres eliminar este registro? Al aceptar no se puede recuperar la informacion",
  textButtonRed = "Eliminar"
}) => {

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { authData } = useAuth();

  const handleSubmit = async () => {
    try {
      const body = {};
      body[field_name] = idToDelete;
      const fetchResponse = await fetch(deleteOne, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(body),
      });

      const dataFormatted = await fetchResponse.json();

      if (fetchResponse.status != 200) {
        setErrorMessage(dataFormatted.message);
        setSuccessMessage('');
        return
      }

      setSuccessMessage(dataFormatted.message);
      setErrorMessage('');
      onSubmitDelete();
      return
    } catch (error) {
      setErrorMessage('Error en la conexión');
      setSuccessMessage('');
    }
  };

  return (
    <div className="alert__background__black">
      <div className="alert__container">
        <div className="alert__header modal__delete">
          <p>{messageToDelete}</p>
        </div>
        <div className="modal__delete__message ">
          {successMessage && successMessage.length > 0 && <div className="success-message">{successMessage}</div>}
          {errorMessage && errorMessage.length > 0 && <div className="error-message">{errorMessage}</div>}
        </div>
        <div className="alert__footer modal__delete">
          <ButtonRed onClick={handleSubmit} title={textButtonRed} />
          <ButtonBlue onClick={() => handleModalDelete()} title={'Volver'} />
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
