import { useState, useEffect } from 'react';
import PersonalDetailsSection from './PersonalDetailsSection';
import EmployeeDataSection from './EmployeeDataSection';
import AddressdataSection from './AddressDataSection';

const CreateUser = () => {
  const [entityData, setEntityData] = useState({
    name_entity: '',
    lastname_entity: '',
    date_birth_entity: '',
    sex_fk: '',
    nacionality_fk: '',
  });

  const [contactEntityData, setContactEntityData] = useState({
    value_ec: "",
    contact_fk: "",
  })

  const [employeeData, setEmployeeData] = useState({
    file_employee: "",
    date_entry_employee: ""
  })

  const [occupationDepartmentData, setOccupationDepartmentData] = useState({
    department_fk: "",
    occupation_fk: ""
  })

  const [addressData, setAddressData] = useState({
    description_address: "",
    city_fk: ""
  })

  console.log(entityData);
  console.log(employeeData);
  console.log(occupationDepartmentData);
  console.log(contactEntityData);
  console.log(addressData);
  return (
    <div className="container__page">

      <form className='form__container form__create__user' >
        
      <PersonalDetailsSection setEntityData={setEntityData} setContactEntityData={setContactEntityData}/>

      <EmployeeDataSection 
      setEmployeeData={setEmployeeData}
      setOccupationDepartmentData={setOccupationDepartmentData}
      />


      <AddressdataSection
      setAddressData={setAddressData}
      />
      </form>


    </div>
  );
};

export default CreateUser;
