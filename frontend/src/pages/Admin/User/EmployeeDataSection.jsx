import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const EmployeeDataSection = ({ setEmployeeData, setOccupationDepartmentData }) => {
  const [listOccupations, setListOccupations] = useState([]);
  const [listDepartments, setListDepartments] = useState([]);

  const { authData } = useAuth();

  const apiUrls = [
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/occupations`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/departments`,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [occupationsResponse, departmentsResponse] = await Promise.all(
          apiUrls.map((url) =>
            fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authData.token}`,
              },
            })
          )
        );
        if (occupationsResponse.status === 403 || departmentsResponse.status === 403) {
          alert('Error al obtener los datos');
          return;
        }

        const [occupationsData, departmentsData] = await Promise.all([
          occupationsResponse.json(),
          departmentsResponse.json(),
        ]);

        const activeOccupations = occupationsData.queryResponse.filter(
          (occupation) => occupation.status_occupation === 1
        );

        const activeDepartments = departmentsData.queryResponse.filter(
          (department) => department.status_department === 1
        );

        setListOccupations(activeOccupations || []);
        setListDepartments(activeDepartments || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [authData.token]);

  const handleChangeEmployee = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeOccupationDepartment = (e) => {
    const { name, value } = e.target;
    setOccupationDepartmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container__section">
      <div className="container__title-form">
        <h2>Información de Trabajo</h2>
      </div>

      <div className="input__form__div">
        <label htmlFor="file_employee" className="input__form__div__label">
          Legajo
        </label>
        <input 
          onChange={handleChangeEmployee} 
          name="file_employee" 
          type="text"
          id='file_employee'
          className="input__form__div__input" 
          placeholder='Número de legajo'
        />
      </div>

      <div className="input__form__div">
        <label htmlFor="date_entry_employee" className="input__form__div__label">
          Fecha de ingreso
        </label>
        <input
          onChange={handleChangeEmployee}
          name="date_entry_employee"
          type="date"
          id='date_entry_employee'
          className="input__form__div__input"
        />
      </div>

      <div className="input__form__div">
        <label htmlFor="occupation_fk" className="input__form__div__label">
          Ocupación
        </label>
        <select 
          onChange={handleChangeOccupationDepartment} 
          name="occupation_fk" 
          className="input__form__div__input"
          id='occupation_fk'
        >
          <option key={''} value={''}>
            Ocupación
          </option>
          {listOccupations.map((occupation) => (
            <option key={occupation.id_occupation} value={occupation.id_occupation}>
              {occupation.name_occupation}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label htmlFor="department_fk" className="input__form__div__label">
          Departamento
        </label>
        <select
          onChange={handleChangeOccupationDepartment}
          name="department_fk"
          className="input__form__div__input"
          id='department_fk'
        >
          <option key={''} value={''}>
            Departamento
          </option>
          {listDepartments.map((department) => (
            <option key={department.id_department} value={department.id_department}>
              {department.name_department}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EmployeeDataSection;
