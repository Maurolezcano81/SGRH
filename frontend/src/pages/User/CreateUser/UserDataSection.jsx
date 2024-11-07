import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';

const UserDataSection = ({
  setUserData,
  setAvatarUser,
  setProfileData,
  errorUser,
  errorFile,
  errorPermission,
  setCriticalErrorToggle,
  setCriticalErrorMessage,
}) => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [listProfiles, setListProfiles] = useState([]);
  const getProfiles = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_PROFILE}`;

  const { authData } = useAuth();

  useEffect(() => {
    if (authData.token) {
      const fetchProfilesRequest = async () => {
        try {
          const fetchResponse = await fetch(getProfiles, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authData.token}`,
            },
          });
          const profilesData = await fetchResponse.json();

          if (fetchResponse.status === 500) {
            setCriticalErrorToggle(true);
            setCriticalErrorMessage(profilesData.message);
            return;
          }

          if (!fetchResponse.ok) {
            throw new Error('Error en la solicitud de perfiles');
          }

          setListProfiles(profilesData.list);
        } catch (error) {
          console.error('Error en la solicitud de perfiles:', error);
        }
      };

      fetchProfilesRequest();
    }
  }, [authData.token, setCriticalErrorMessage, setCriticalErrorToggle]);

  const onChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'username_user') {
      setUserData((prevState) => ({
        ...prevState,
        pwd_user: value,
      }));
    }
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
    setAvatarUser(null);
  };

  const onChangePermission = (e) => {
    setProfileData(e.target.value);
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
          placeholder="Usuario"
          className="input__form__div__input"
          name="username_user"
          id="username_user"
          type="text"
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
      {errorFile && (
        <div className="error__validation__form">
          <ErrorMessage error={errorFile} />
        </div>
      )}
      {errorUser && (
        <div className="error__validation__form">
          <ErrorMessage error={errorUser} />
        </div>
      )}

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="value_profile">
          Perfil
        </label>
        <select
          className="input__form__div__input"
          onChange={onChangePermission}
          name="value_profile"
          id="value_profile"
        >
          <option value="" key="">
            Seleccione un Perfil
          </option>

          {listProfiles &&
            listProfiles.map((profile) => (
              <option key={profile.id_profile} value={profile.id_profile}>
                {profile.name_profile}
              </option>
            ))}
        </select>
      </div>
      {errorPermission && <ErrorMessage error={errorPermission} />}
    </div>
  );
};

export default UserDataSection;
