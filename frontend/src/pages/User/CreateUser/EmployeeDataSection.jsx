import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';

const EmployeeDataSection = ({
  setEmployeeData,
  setOccupationDepartmentData,
  error,
  setCriticalErrorToggle,
  setCriticalErrorMessagge,
}) => {
  const [listOccupations, setListOccupations] = useState([]);
  const [listDepartments, setListDepartments] = useState([]);

  const { authData } = useAuth();

  const apiUrls = [
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}`,
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (authData.token) {
        try {
          const [occupationsResponse, departmentsResponse] = await Promise.all(
            apiUrls.map((url) =>
              fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authData.token}`,
                },
              })
            )
          );

          const [occupationsData, departmentsData] = await Promise.all([
            occupationsResponse.json(),
            departmentsResponse.json(),
          ]);

          if (occupationsResponse.status === 500 || departmentsResponse.status === 500) {
            setCriticalErrorToggle(true);
            setCriticalErrorMessagge(occupationsData.message || departmentsData.message);
            return;
          }

          setListOccupations(occupationsData.list || []);
          setListDepartments(departmentsData.list || []);
        } catch (error) {
          console.error(error.message);
        }
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
          id="file_employee"
          className="input__form__div__input"
          placeholder="Número de legajo"
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
          id="date_entry_employee"
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
          id="occupation_fk"
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
          id="department_fk"
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
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default EmployeeDataSection;
