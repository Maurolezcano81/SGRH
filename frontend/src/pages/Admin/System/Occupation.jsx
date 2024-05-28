import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import PreferencesTableHeader from '../../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../../components/Table/TablePreferences/PreferencesBodyRow';
import PreferenceTitle from './PreferenceTitle';
import ModalAdd from '../ModalAdd';

const Occupation = () => {
  const [occupations, setOccupations] = useState([]);
  const [occupationsFormatted, setOccupationsFormatted] = useState([]);
  const [toggleModalAdd, setToggleModalAdd] = useState(false);
  const [toggleModalUpdate, setToggleModalUpdate] = useState(false);


  const [isNewField, setIsNewField] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [isUpdatedField, setIsUpdatedField] = useState(false);

  const { authData } = useAuth();

  const getOccupationsUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupations`;

  const getOccupationUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation`;

  const postCreateOccupationUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation/status` 

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const fetchResponse = await fetch(getOccupationsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });
        if (!fetchResponse.ok) {
          throw new Error('Ha ocurrido un error al obtener las ocupaciones');
        }

        const data = await fetchResponse.json();

        setOccupations(data.queryResponse);
        formatOccupations(data.queryResponse); // Formatea las ocupaciones después de obtener los datos
      } catch (error) {
        console.error('Error al obtener las ocupaciones', error);
      }
    };

    fetchOccupations();
  }, [authData.token, isNewField, isStatusChanged]);

  const formatOccupations = (occupations) => {
    const formatted = occupations.map((occupation) => ({
      ...occupation,
      salary_occupation: currencyFormatter(occupation.salary_occupation),
    }));
    setOccupationsFormatted(formatted);
  };

  const onSubmitCreate = (newItem) => {
    setOccupations([...occupations, newItem]);
    formatOccupations([...occupations, newItem]);
    handleDependencyAdd();
  };

  const handleEdit = (item) => {
    console.log('Editar:', item);
  };

  const handleDelete = async (item) => {
    try {
      const fetchResponse =  await fetch(toggleStatus, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authData.token}`
        },
        body: JSON.stringify({
          id_occupation: item.id_occupation,
          status_occupation: item.status_occupation === 1 ? 0 : 1
        })
      })     

      handleDependencyStatus();
    } catch (error) {
      console.log("error al eliminar")
    }
    
  };

  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

  const handleDependencyAdd = () => {
    setIsNewField(!isNewField);
  };

  const handleDependencyStatus = () =>{
    setIsStatusChanged(!isStatusChanged)
  }

  const currencyFormatter = (value) => {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  return (
    <div className="preference__container">
      <PreferenceTitle title="Ocupación" handleModalAdd={handleModalAdd} />
      {toggleModalAdd && (
        <ModalAdd
          title_modal={'Nueva Ocupacion'}
          labels={['Nombre', 'Salario']}
          placeholders={['Ingrese nombre', 'Ingrese el salario']}
          method={'POST'}
          fetchData={['name_occupation', 'salary_occupation']}
          urlCreate={postCreateOccupationUrl}
          onSubmitCreate={onSubmitCreate}
          handleModalAdd={handleModalAdd}
        />
      )}

      <table className="table__preference">
        <thead className="table__preference__head">
          <tr>
            <PreferencesTableHeader keys={['Nombre', 'Salario', 'Estado', 'Acciones']} />
          </tr>
        </thead>
        <tbody className="table__preference__body">
          <PreferencesBodyRow
            items={occupationsFormatted}
            keys={['name_occupation', 'salary_occupation', 'status_occupation']}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Occupation;
