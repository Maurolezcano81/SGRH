import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalDetailsSection from './PersonalDetailsSection';
import EmployeeDataSection from './EmployeeDataSection';
import AddressdataSection from './AddressDataSection';
import PermissionDataSection from './PermissionDataSection';
import UserDataSection from './UserDataSection';
import ButtonBlue from '../../../components/ButtonBlue';
import ButtonRed from '../../../components/ButtonRed';
import AlertSuccesfullyBackground from '../../../components/Alerts/AlertSuccesfullyBackground';
import useAuth from '../../../hooks/useAuth';
import AlertError from '../../../components/Alerts/AlertError';

const CreateUser = () => {
  const createUserUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/user/create`;
  const navigate = useNavigate();

  const { authData } = useAuth();

  const [isSuccessfully, setIsSuccessfully] = useState(false);
  const [successfullyMessage, setSuccessfullyMessage] = useState('');

  const [entityData, setEntityData] = useState({
    name_entity: '',
    lastname_entity: '',
    date_birth_entity: '',
    sex_fk: '',
    nacionality_fk: '',
  });

  const [documentEntityData, setDocumentEntityData] = useState({
    document_fk: '',
    value_ed: '',
  });

  const [contactEntityData, setContactEntityData] = useState({
    value_ec: '',
    contact_fk: '',
  });

  const [employeeData, setEmployeeData] = useState({
    file_employee: '',
    date_entry_employee: '',
  });

  const [occupationDepartmentData, setOccupationDepartmentData] = useState({
    department_fk: '',
    occupation_fk: '',
  });

  const [addressData, setAddressData] = useState({
    description_address: '',
    city_fk: '',
  });

  const [userData, setUserData] = useState({
    username_user: '',
    pwd_user: '',
  });

  const [profileData, setProfileData] = useState('');

  const [avatar_user, setAvatarUser] = useState(null);

  const [errorsMessage, setErrorsMessage] = useState({});
  const [criticalErrorToggle, setCriticalErrorToggle] = useState(false);
  const [criticalErrorMessage, setCriticalErrorMessagge] = useState(null);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('avatar_url', avatar_user);
    data.append('entity_data', JSON.stringify(entityData));
    data.append('entity_document_data', JSON.stringify(documentEntityData));
    data.append('employee_data', JSON.stringify(employeeData));
    data.append('user_data', JSON.stringify(userData));
    data.append('entity_contact_data', JSON.stringify(contactEntityData));
    data.append('address_data', JSON.stringify(addressData));
    data.append('entity_department_occupation_data', JSON.stringify(occupationDepartmentData));
    data.append('value_profile', profileData);

    try {
      if (authData.token) {
        const fetchResponse = await fetch(createUserUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
          body: data,
        });

        const dataFetch = await fetchResponse.json();

        if (fetchResponse.status === 422) {
          setIsSuccessfully(false);
          setErrorsMessage(() => ({
            [dataFetch.group]: dataFetch.message,
          }));
          return;
        }

        if (fetchResponse.status === 500) {
          setCriticalErrorToggle(true);
          setCriticalErrorMessagge(dataFetch.message);
          return;
        }

        setIsSuccessfully(true);
        setSuccessfullyMessage(dataFetch.message);

        setTimeout(() => {
          navigate('/rrhh/personal/ver');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container__page">
      <form className="form__container form__create__user">
        <PersonalDetailsSection
          setEntityData={setEntityData}
          setContactEntityData={setContactEntityData}
          setDocumentEntityData={setDocumentEntityData}
          error={errorsMessage?.entity}
          token={authData.token}
          setCriticalErrorMessagge={setCriticalErrorMessagge}
          setCriticalErrorToggle={setCriticalErrorToggle}
        />

        <UserDataSection
          setUserData={setUserData}
          setAvatarUser={setAvatarUser}
          setProfileData={setProfileData} // Añadido para el componente PermissionDataSection
          errorUser={errorsMessage?.user}
          errorFile={errorsMessage?.file}
          errorPermission={errorsMessage?.permission} // Añadido para el componente PermissionDataSection
          token={authData.token}
          setCriticalErrorMessagge={setCriticalErrorMessagge}
          setCriticalErrorToggle={setCriticalErrorToggle}
        />

        <EmployeeDataSection
          setEmployeeData={setEmployeeData}
          setOccupationDepartmentData={setOccupationDepartmentData}
          error={errorsMessage?.employee}
          token={authData.token}
          setCriticalErrorMessagge={setCriticalErrorMessagge}
          setCriticalErrorToggle={setCriticalErrorToggle}
        />

        <AddressdataSection
          setAddressData={setAddressData}
          error={errorsMessage?.address}
          token={authData.token}
          setCriticalErrorMessagge={setCriticalErrorMessagge}
          setCriticalErrorToggle={setCriticalErrorToggle}
        />

        <div className="form__button__container">
          <ButtonBlue title={'Crear Usuario'} onClick={onSubmitForm} />
        </div>
      </form>
      {isSuccessfully && <AlertSuccesfullyBackground message={successfullyMessage} />}
      {criticalErrorToggle && <AlertError errorMessage={criticalErrorMessage} />}
    </div>
  );
};

export default CreateUser;
