import { useState } from 'react';
import ButtonBlue from '../ButtonBlue';

const ChangePwd = ({ handleChangePwd, idUserToChange }) => {
  const [actualPwd, setActualPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [repeatPwd, setRepeatPwd] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(actualPwd);
    console.log(newPwd);
    console.log(repeatPwd);
  };

  return (
    <form onSubmit={handleSubmit} className="change__pwd__container container__section">
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

      {message && <p className="error__validation__form-p">{message}</p>}
      <div className="form__button__container">
        <ButtonBlue title="Guardar Cambios" />
      </div>
    </form>
  );
};

export default ChangePwd;
