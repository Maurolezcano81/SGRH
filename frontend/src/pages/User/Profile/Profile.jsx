import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ButtonEditable from '../../../components/Buttons/ButtonEditable';
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
  const { value_user, isRedirectToChangePwd } = location.state || {};

  const [userData, setUserData] = useState([]);
  const [personalData, setPersonalData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  const [userDataFormatted, setUserDataFormatted] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [toggleChangePwd, setToggleChangePwd] = useState(false);
  const [redirectedToChangePwd, setRedirectedToChangePwd] = useState(false);

  const [updateDependency, setUpdateDependency] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isRedirectToChangePwd && !redirectedToChangePwd) {
      setToggleChangePwd(true); 
      setRedirectedToChangePwd(true); 
    }
  }, [isRedirectToChangePwd, redirectedToChangePwd]);


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
    [authData.token, value_user, permissionsData?.canEdit, permissionsData?.isTheSameUser, updateDependency],
    userData[0]?.id_user
  );

  const formatted = (array) => {
    const format = array.map((item) => ({
      ...item,
    }));
    setUserDataFormatted(format);
  };

  const updateProfile = () => {
    setUpdateDependency(!updateDependency);
  }

  const user = userData?.user?.["0"];

  const occupation = employeeData?.occupation?.["0"];
  const department = employeeData?.department?.["0"];

  const profilePicture = `${process?.env.SV_HOST}${process?.env.SV_PORT}${process?.env.SV_ADDRESS}/${user?.avatar_user}`;

  const changeEditMode = () => {
    setIsEditMode(!isEditMode);
  }

  const handleChangePwdToggle = () => {
    setToggleChangePwd(prev => !prev);
    if (!redirectedToChangePwd) {
      setRedirectedToChangePwd(true);
    }
  };

  return (
    <div className="container__profile">
      <div className="container__title-form">
        <h2>Perfil de Empleado</h2>
      </div>
      <div className="profile__header">
        <div className="profile__header__container">
          <div className="profile__img__container">
            {userData && user && (
              <img
                src={profilePicture}
                alt="Avatar"
              />
            )}
          </div>
          {personalData?.entity?.[0] ? (
            <div className="profile__personal__data__container">
              <h2>{`${personalData.entity[0].name_entity} ${personalData.entity[0].lastname_entity}`}</h2>
              <p>{occupation?.name_occupation}</p>
              <p>{department?.name_department}</p>
            </div>
          ) : (
            <p>No hay datos personales disponibles.</p>
          )}
        </div>

        <div className="profile__header__buttons">
          <div>
            {!permissionsData?.isTheSameUser ? (
              <ButtonEditable color={"white"} title={'Mensaje'} data-id={userData[0]?.id_user} />
            ) : null}
            {permissionsData?.isTheSameUser ? (
              <ButtonEditable color={"white"} title={'Solicitudes'} data-id={userData[0]?.id_user} />
            ) : null}
          </div>

          <div>
            {(permissionsData?.isTheSameUser || permissionsData?.canEdit) && (
              <ButtonEditable
                color={isEditMode ? "blue" : "white"}
                title="Editar Perfil"
                data-id={userData[0]?.id_user}
                onClick={changeEditMode}
              />
            )}

            {permissionsData?.isTheSameUser || permissionsData?.canEdit ? (
              <ButtonEditable
                color={toggleChangePwd ? "blue" : "white"}
                title={'Cambiar Contraseña'}
                data-id={user?.id_user}
                onClick={handleChangePwdToggle}
              />
            ) : null}
          </div>
        </div>
        {(toggleChangePwd) && (permissionsData?.isTheSameUser === true) && (
          <ChangePwdEmployee
            handleChangePwd={handleChangePwdToggle}
            idUserToChange={user?.id_user}
          />
        )}

        {(toggleChangePwd) && ((permissionsData?.isAdmin === 1 || permissionsData?.isRrhh === 1) && permissionsData?.isTheSameUser === false) && (
          <ChangePwdAdmin
            handleChangePwd={handleChangePwdToggle}
            idUserToChange={user?.id_user}
          />
        )}
      </div>
      <div className="group__container">

        <PersonalData
          personalData={personalData}
          updateProfile={updateProfile}
          permissionsData={permissionsData}
          isEditMode={isEditMode}
        />
      </div>


      <div className="group__container">
        <AddressData
          addressData={addressData}
          updateProfile={updateProfile}
          permissionsData={permissionsData}
          isEditMode={isEditMode}
        />
      </div>

      <div className="group__container">
        <UserData
          userData={userData}
          updateProfile={updateProfile}
          permissionsData={permissionsData}
          isEditMode={isEditMode}
        />
      </div>

      <div className="group__container">
        <EmployeeData
          employeeData={employeeData}
          updateProfile={updateProfile}
          permissionsData={permissionsData}
          isEditMode={isEditMode}
        />
      </div>

    </div>
  );
};

export default Profile;
