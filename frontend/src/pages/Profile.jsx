import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonWhiteWithShadow from '../components/Buttons/ButtonWhiteWithShadow';
import useAuth from '../hooks/useAuth';
import ChangePwdEmployee from '../components/Others/ChangePwdEmployee';
import ChangePwdAdmin from '../components/Others/ChangePwdAdmin';

const Profile = () => {
  const { authData } = useAuth();
  const location = useLocation();
  const { value_user } = location.state || {};

  const [userData, setUserData] = useState([]);
  const [userDataFormatted, setUserDataFormatted] = useState([]);
  const [entityData, setEntityData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [occupationsData, setOccupationsData] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);

  const [toggleChangePwd, setToggleChangePwd] = useState(false);

  useEffect(
    () => {
      const DataProfile = async () => {
        if (!authData.token) {
          return console.log('No token');
        }
        const fetchResponse = await fetch('http://localhost:4500/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({
            value_user: value_user,
          }),
        });

        const fetchData = await fetchResponse.json();

        if (fetchResponse.status != 200) {
          return console.log(fetchResponse.status);
        }

        setUserData(fetchData.user__data);
        setEntityData(fetchData.entity__data);
        setDepartmentData(fetchData.department__data);
        setOccupationsData(fetchData.occupation__data);
        setPermissionsData([fetchData.permissions__data]);
      };

      DataProfile();
    },
    [authData.token, value_user, permissionsData[0]?.canEdit, permissionsData[0]?.isTheSameUser],
    userData[0]?.id_user
  );

  console.log(authData);

  const formatted = (array) => {
    const format = array.map((item) => ({
      ...item,
    }));
    setUserDataFormatted(format);
  };

  return (
    <div className="container__profile">
      <div className="container__title-form">
        <h2>Perfil de Empleado</h2>
      </div>
      <div className="profile__header">
        <div className="profile__header__container">
          <div className="profile__img__container">
            <img src={`${process?.env.SV_IMAGE_URL}${userData[0]?.avatar_user}`} alt="" />
          </div>
          <div className="profile__personal__data__container">
            <h2>{`${entityData[0]?.name_entity} ${entityData[0]?.lastname_entity}`}</h2>
            <p>{occupationsData[0]?.name_occupation}</p>
            <p>{departmentData[0]?.name_department}</p>
          </div>
        </div>

        <div className="profile__header__buttons">
          <div>
            <ButtonWhiteWithShadow title={'Mensaje'} data-id={userData[0]?.id_user} />
            {permissionsData[0]?.isTheSameUser ? (
              <ButtonWhiteWithShadow title={'Solicitudes'} data-id={userData[0]?.id_user} />
            ) : null}
          </div>

          <div>
            {permissionsData[0]?.isTheSameUser ? (
              <ButtonWhiteWithShadow title={'Editar Perfil'} data-id={userData[0]?.id_user} />
            ) : null}

            {permissionsData[0]?.isTheSameUser || permissionsData[0]?.canEdit ? (
              <ButtonWhiteWithShadow
                title={'Cambiar Contraseña'}
                data-id={userData[0]?.id_user}
                onClick={() => setToggleChangePwd(!toggleChangePwd)}
              />
            ) : null}
          </div>
        </div>
        {toggleChangePwd && (authData.profile_fk === 3 || authData.profile_fk === 4) && (
          <ChangePwdEmployee
            handleChangePwd={() => setToggleChangePwd(!toggleChangePwd)}
            idUserToChange={userData[0]?.id_user}
          />
        )}

        {toggleChangePwd && (authData.profile_fk === 1 || authData.profile_fk === 2) && (
          <ChangePwdAdmin
            handleChangePwd={() => setToggleChangePwd(!toggleChangePwd)}
            idUserToChange={userData[0]?.id_user}
          />
        )}
      </div>
      <div className="group__container">
        <div className="section__container">
          <div className="container__title-form">
            <h2>Información de trabajo</h2>
          </div>
          <div className="input__form__div">
            <p className="input__form__div__label">Puesto de trabajo </p>
            <p className="input__form__div__input">{occupationsData[0]?.name_occupation}</p>
          </div>
          <div className="input__form__div">
            <p className="input__form__div__label">Departamento</p>
            <p className="input__form__div__input">{departmentData[0]?.name_department}</p>
          </div>
        </div>

        <div className="section__container">
          <div className="container__title-form">
            <h2>Usuario</h2>
          </div>
          <div className="input__form__div">
            <p className="input__form__div__label">Nombre de usuario </p>
            <p className="input__form__div__input">{userData[0]?.username_user}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
