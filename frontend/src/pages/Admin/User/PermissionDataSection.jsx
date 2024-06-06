import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';

const PermissionDataSection = ({ setProfileData, error, setCriticalErrorToggle, setCriticalErrorMessagge }) => {
  const getProfiles = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/profiles`;

  const { authData } = useAuth();
  const [listProfiles, setListProfiles] = useState([]);

  useEffect(() => {
    if (authData.token) {
      const fetchProfilesRequest = async () => {
        try {
          const fetchResponse = await fetch(getProfiles, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authData.token}`,
            },
          });
          const profilesData = await fetchResponse.json();

          if (fetchResponse.status === 500) {
            setCriticalErrorToggle(true);
            setCriticalErrorMessagge(profilesData.message);
            return;
          }

          if (!fetchResponse.ok) {
            throw new Error('Error en la solicitud de perfiles');
          }

          const activeProfiles = profilesData.queryResponse.filter((profile) => profile.status_profile === 1);

          setListProfiles(activeProfiles);
        } catch (error) {
          console.error('Error en la solicitud de perfiles:', error);
        }
      };

      fetchProfilesRequest();
    }
  }, [authData.token]);

  const onChangePermission = (e) => {
    setProfileData(e.target.value);
  };

  return (
    <div className="container__section">
      <div className="container__title-form">
        <h2>Permisos</h2>
      </div>
      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="value_profile">
          Permiso
        </label>
        <select
          className="input__form__div__input"
          onChange={onChangePermission}
          name="value_profile"
          id="value_profile"
        >
          <option value="" key="">
            Seleccione un permiso
          </option>
          {listProfiles.map((profile) => (
            <option key={profile.id_profile} value={profile.id_profile}>
              {profile.name_profile}
            </option>
          ))}
        </select>
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default PermissionDataSection;
