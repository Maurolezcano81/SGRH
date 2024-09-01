import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonWhiteWithShadow from '../../../components/Buttons/ButtonWhiteWithShadow';
import useAuth from '../../../hooks/useAuth';
import ChangePwdEmployee from '../../../components/Others/ChangePwdEmployee';
import ChangePwdAdmin from '../../../components/Others/ChangePwdAdmin';
import PersonalData from './PersonalData';

const Profile = () => {
  const profileURL = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USER_PROFILE}`

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

      try {
        const DataProfile = async () => {
          if (!authData.token) {
            return console.log('No token');
          }
          const fetchResponse = await fetch(profileURL, {
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
      } catch (error) {
        console.log(error)
      }

    },
    [authData.token, value_user, permissionsData[0]?.canEdit, permissionsData[0]?.isTheSameUser],
    userData[0]?.id_user
  );


  const formatted = (array) => {
    const format = array.map((item) => ({
      ...item,
    }));
    setUserDataFormatted(format);
  };

  return (
    <div className="container__profile">
      <img src={`${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}${userData[0]?.avatar_user}`} alt="" />
      <div className="container__title-form">
        <h2>Perfil de Empleado</h2>
      </div>
      <div className="profile__header">
        <div className="profile__header__container">
          <div className="profile__img__container">
            <img src={`${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}${userData[0]?.avatar_user}`} alt="" />
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
        {toggleChangePwd && ((authData.profile_fk === 1 || authData.profile_fk === 2 || authData.profile_fk === 3 || authData.profile_fk === 4) && permissionsData[0]?.isTheSameUser === true) && (
          <ChangePwdEmployee
            handleChangePwd={() => setToggleChangePwd(!toggleChangePwd)}
            idUserToChange={userData[0]?.id_user}
          />
        )}

        {toggleChangePwd && ((authData.profile_fk === 1 || authData.profile_fk === 2) && permissionsData[0]?.isTheSameUser === false) && (
          <ChangePwdAdmin
            handleChangePwd={() => setToggleChangePwd(!toggleChangePwd)}
            idUserToChange={userData[0]?.id_user}
          />
        )}
      </div>
      <div className="group__container">

        <PersonalData
          occupation_data={occupationsData}
          department_data={departmentData}
          entity_data={entityData}
        />

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
