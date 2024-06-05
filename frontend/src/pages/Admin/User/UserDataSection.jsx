import { useState } from 'react';

const UserDataSection = ({ setUserData, setAvatarUser }) => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const onChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setIsFileUploaded(false);
      setFileUrl('');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setFileUrl(fileUrl);
    setIsFileUploaded(true);
    setAvatarUser(file);
  };

  const onClickCloseAvatar = () => {
    setIsFileUploaded(false);
    setFileUrl('');
    return;
  };

  return (
    <div className="container__section">
      <div className="container__title-form">
        <h2>Datos de usuario</h2>
      </div>

      <div className="input__form__div">
        <label htmlFor="username_user" className="input__form__div__label">
          Nombre de Usuario
        </label>
        <input
          onChange={onChangeUserData}
          placeholder='Usuario'
          className="input__form__div__input"
          name="username_user"
          id="username_user"
          type="text"
        />
      </div>

      <div className="input__form__div">
        <label htmlFor="pwd_user" className="input__form__div__label">
          Contraseña
        </label>
        <input
          onChange={onChangeUserData}
          placeholder='Contraseña'
          className="input__form__div__input"
          name="pwd_user"
          id="pwd_user"
          type="password"
        />
      </div>

      <div className="input__form__div">
        <label htmlFor="avatar_user" className="input__form__div__label">
          Avatar
        </label>
        <div className="input__form__div__input input__file__avatar__container">
          <input
            className="input__file__avatar"
            onChange={onChangeAvatar}
            name="avatar_user"
            id="avatar_user"
            type="file"
            accept="image/*"
          />

          {isFileUploaded && (
            <div className="preview__image__container">
              <span onClick={onClickCloseAvatar} className="preview__image-button">
                X
              </span>
              <img className="preview__image__form" src={fileUrl} alt="avatar" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDataSection;
