import { useState } from 'react';
import ButtonBlue from '../ButtonBlue';
import useAuth from '../../hooks/useAuth';
import ButtonRed from '../ButtonRed';

const ChangePwdEmployee = ({ handleChangePwd, idUserToChange }) => {
  const [actualPwd, setActualPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [repeatPwd, setRepeatPwd] = useState('');
  const [message, setMessage] = useState(null);

  const { authData } = useAuth();

  const changePwdUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.U_USER_EMPLOYEE_PWD}`;

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();

    if (newPwd != repeatPwd) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    const fetchResponse = await fetch(changePwdUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        id_user: idUserToChange,
        pwd_new: newPwd,
        pwd_actual: actualPwd,
      }),
    });

    const data = await fetchResponse.json();

    if (fetchResponse.status === 401) {
      setMessage(data.message);
    }

    setMessage(data.message);
  };
  return (
    <div className='profile__header__container'>
      <form onSubmit={handleSubmitEmployee} className="change__pwd__container container__section">
        <div className="input__form__div">
          <label className="input__form__div__label" htmlFor="pwd_user">
            Contraseña actual
          </label>
          <input
            type="password"
            className="input__form__div__input"
            name="pwd_user"
            onChange={(e) => setActualPwd(e.target.value)}
          />
        </div>

        <div className="input__form__div">
          <label className="input__form__div__label" htmlFor="new_pwd">
            Contraseña nueva
          </label>
          <input
            type="password"
            className="input__form__div__input"
            name="new_pwd"
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>

        <div className="input__form__div">
          <label className="input__form__div__label" htmlFor="repeat_new_pwd">
            Repetir contraseña nueva
          </label>
          <input
            type="password"
            className="input__form__div__input"
            name="repeat_new_pwd"
            onChange={(e) => setRepeatPwd(e.target.value)}
          />
        </div>

        <div className="preferences__modal__error change__pwd ">
          {message && <p className="error__validation__form-p">{message}</p>}
        </div>
        <div className="form__button__container">
          <ButtonRed title={'Salir'} onClick={handleChangePwd} />
          <ButtonBlue title="Guardar Cambios" />
        </div>
      </form>
    </div>
  );
};

export default ChangePwdEmployee;
