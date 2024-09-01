import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonWhiteWithShadow from '../../../components/Buttons/ButtonWhiteWithShadow';
import useAuth from '../../../hooks/useAuth';
import ChangePwdEmployee from '../../../components/Others/ChangePwdEmployee';
import ChangePwdAdmin from '../../../components/Others/ChangePwdAdmin';
import PersonalData from './Read/PersonalData';
import UserData from './Read/UserData';
import AddressData from './Read/AddressData';
import EmployeeData from './Read/EmployeeData';

const Profile = () => {
  const profileURL = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.USER_PROFILE}`

  const { authData } = useAuth();
  const location = useLocation();
  const { value_user } = location.state || {};

  const [userData, setUserData] = useState([]);
  const [personalData, setPersonalData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  const [userDataFormatted, setUserDataFormatted] = useState([]);
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

          setPersonalData(fetchData.personalData);
          setUserData(fetchData.userData);
          setAddressData(fetchData.addressData);
          setEmployeeData(fetchData.employeeData);
          setPermissionsData(fetchData.permissions__data);
        };

        DataProfile();


      } catch (error) {
        console.log(error)
      }

    },
    [authData.token, value_user, permissionsData?.canEdit, permissionsData?.isTheSameUser],
    userData[0]?.id_user
  );


  const formatted = (array) => {
    const format = array.map((item) => ({
      ...item,
    }));
    setUserDataFormatted(format);
  };

  const user = userData?.user?.["0"];

  const occupation = employeeData?.occupation?.["0"];
  const department = employeeData?.department?.["0"];

  const profilePicture = `${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}/${user?.avatar_user}`;

  return (
    <div className="container__profile">
      {userData && user && (
        <img
          src={profilePicture}
          alt="Avatar"
        />
      )}
      <div className="container__title-form">
        <h2>Perfil de Empleado</h2>
      </div>
      <div className="profile__header">
        <div className="profile__header__container">
          <div className="profile__img__container">
            <img src={`${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}${userData[0]?.avatar_user}`} alt="" />
          </div>
          {personalData?.entity?.[0] ? (
            <div className="profile__personal__data__container">
              <h2>{`${personalData.entity[0].name_entity} ${personalData.entity[0].lastname_entity}`}</h2>
              <p>{personalData.entity[0].name_occupation}</p>
              <p>{personalData.entity[0].name_department}</p>
            </div>
          ) : (
            <p>No hay datos personales disponibles.</p>
          )}
        </div>

        <div className="profile__header__buttons">
          <div>
            {!permissionsData?.isTheSameUser ? (
              <ButtonWhiteWithShadow title={'Mensaje'} data-id={userData[0]?.id_user} />
            ) : null}
            {permissionsData?.isTheSameUser ? (
              <ButtonWhiteWithShadow title={'Solicitudes'} data-id={userData[0]?.id_user} />
            ) : null}
          </div>

          <div>
            {permissionsData?.isTheSameUser ? (
              <ButtonWhiteWithShadow title={'Editar Perfil'} data-id={userData[0]?.id_user} />
            ) : null}

            {permissionsData?.isTheSameUser || permissionsData?.canEdit ? (
              <ButtonWhiteWithShadow
                title={'Cambiar Contraseña'}
                data-id={userData[0]?.id_user}
                onClick={() => setToggleChangePwd(!toggleChangePwd)}
              />
            ) : null}
          </div>
        </div>
        {toggleChangePwd && ((authData.profile_fk === 1 || authData.profile_fk === 2 || authData.profile_fk === 3 || authData.profile_fk === 4) && permissionsData?.isTheSameUser === true) && (
          <ChangePwdEmployee
            handleChangePwd={() => setToggleChangePwd(!toggleChangePwd)}
            idUserToChange={userData[0]?.id_user}
          />
        )}

        {toggleChangePwd && ((authData.profile_fk === 1 || authData.profile_fk === 2) && permissionsData?.isTheSameUser === false) && (
          <ChangePwdAdmin
            handleChangePwd={() => setToggleChangePwd(!toggleChangePwd)}
            idUserToChange={userData[0]?.id_user}
          />
        )}
      </div>
      <div className="group__container">

        <PersonalData
          personalData={personalData}
        />


        <EmployeeData
          employeeData={employeeData}
        />

      </div>

      <div className='group__container'>
        <AddressData
          addressData={addressData}
        />

        <UserData
          userData={userData}
        />
      </div>

    </div>
  );
};

export default Profile;
