import { useState } from 'react';
import ErrorMessage from '../../components/Alerts/ErrorMessage';
import ButtonBlue from '../../components/ButtonBlue';
import ButtonRed from '../../components/ButtonRed';
import useAuth from '../../hooks/useAuth';
const ModalDelete = ({ handleModalDelete, deleteOne, field_name, idToDelete, onSubmitDelete }) => {
  const [message, setMessage] = useState('');

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

      if (!fetchResponse.ok) {
        return setMessage(dataFormatted.message);
      }

      if (fetchResponse.status != 403) {
        return setMessage(dataFormatted.message);
      }
      onSubmitDelete();
    } catch (error) {
      console.log('catch' + error.message);
    }
  };

  return (
    <div className="alert__background__black">
      <div className="alert__container">
        <div className="alert__header modal__delete">
          <p>¿Quieres eliminar este registro? Al aceptar no se puede recuperar la informacion</p>
        </div>
        <div className="modal__delete__message">{message}</div>
        <div className="alert__footer modal__delete">
          <ButtonRed onClick={handleSubmit} title={'Eliminar'} />
          <ButtonBlue onClick={() => handleModalDelete()} title={'Volver'} />
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
