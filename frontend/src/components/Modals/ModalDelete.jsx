import { useState } from 'react';
import ErrorMessage from '../Alerts/ErrorMessage';
import ButtonBlue from '../ButtonBlue';
import ButtonRed from '../ButtonRed';
import useAuth from '../../hooks/useAuth';
import AlertSuccesfully from '../Alerts/AlertSuccesfully';
import AlertError from '../Alerts/AlertError';

const ModalDelete = ({
  handleModalDelete,
  deleteOne,
  field_name,
  idToDelete,
  onSubmitDelete,
  messageToDelete = "¿Quieres eliminar este registro? Al aceptar no se puede recuperar la información",
  textButtonRed = "Eliminar",
}) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { authData } = useAuth();

  const handleSubmit = async () => {
    try {
      const body = { [field_name]: idToDelete };

      const fetchResponse = await fetch(deleteOne, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(body),
      });

      const dataFormatted = await fetchResponse.json();

      if (!fetchResponse.ok) {
        setErrorMessage(dataFormatted.message || 'Ocurrió un error al eliminar el registro.');

        setTimeout(() => {
          setSuccessMessage('');
          handleModalDelete(); 
        }, 1500);
        return;
      }

      setSuccessMessage(dataFormatted.message || 'Registro eliminado exitosamente.');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
        onSubmitDelete();
        handleModalDelete(); // Cerrar el modal
      }, 1500);
    } catch (error) {
      setErrorMessage('Error comunicándose con el servidor, intentelo reiniciando el sitio');
      setSuccessMessage('');
    }
  };

  return (
    <>
      {successMessage && <AlertSuccesfully message={successMessage} />}
      {errorMessage && <AlertError errorMessage={errorMessage} />}

      <div className="alert__background__black">
        <div className="alert__container">
          <div className="alert__header modal__delete">
            <p>{messageToDelete}</p>
          </div>
          <div className="alert__footer modal__delete">
            <ButtonRed onClick={handleSubmit} title={textButtonRed} />
            <ButtonBlue onClick={handleModalDelete} title="Volver" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDelete;
