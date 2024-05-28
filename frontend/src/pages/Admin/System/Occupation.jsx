import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import PreferencesTableHeader from '../../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../../components/Table/TablePreferences/PreferencesBodyRow';
import PreferenceTitle from './PreferenceTitle';
import ModalAdd from '../ModalAdd';
import ModalUpdate from '../ModalUpdate';

const Occupation = () => {
  const [occupations, setOccupations] = useState([]);
  const [occupationsFormatted, setOccupationsFormatted] = useState([]);
  const [toggleModalAdd, setToggleModalAdd] = useState(false);
  const [toggleModalUpdate, setToggleModalUpdate] = useState(false);
  const [selectedOccupationId, setSelectedOccupationId] = useState(null);

  const [isNewField, setIsNewField] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [isUpdatedField, setIsUpdatedField] = useState(false);

  const { authData } = useAuth();

  const getAllUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupations`;
  const getSingleUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation`;
  const updateOneUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation`;
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/create/occupation`;
  const toggleStatus = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation/status`;

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const fetchResponse = await fetch(getAllUrl, {
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
  }, [authData.token, isNewField, isStatusChanged, isUpdatedField]);

  const formatOccupations = (occupations) => {
    const formatted = occupations.map((occupation) => ({
      ...occupation,
      salary_occupation: currencyFormatter(occupation.salary_occupation),
    }));
    setOccupationsFormatted(formatted);
  };

  const currencyFormatter = (value) => {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

  const handleModalUpdate = (occupation) => {
    setSelectedOccupationId(occupation.id_occupation);
    setToggleModalUpdate(!toggleModalUpdate);
  };

  const onSubmitUpdate = () => {
    setIsUpdatedField(!isUpdatedField); // Actualiza la dependencia
    setToggleModalUpdate(!toggleModalUpdate);
  };

  const handleDelete = async (item) => {
    console.log('borrar' + item);
  };

  const onStatusToggle = async (occupation) => {
    selectedOccupationId(occupation.id_occupation);
    setIsStatusChanged(!isStatusChanged);
  };

  const handleDependencyAdd = () => {
    setIsNewField(!isNewField);
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
          createOne={createOne}
          handleDependencyAdd={handleDependencyAdd}
          handleModalAdd={handleModalAdd}
        />
      )}

      {toggleModalUpdate && (
        <ModalUpdate
          title_modal={'Editar Ocupacion'}
          labels={['Nombre', 'Salario', 'Estado']}
          placeholders={['Ingrese nombre', 'Ingrese el salario', 'Ingrese el estado']}
          methodGetOne={'POST'}
          methodUpdateOne={'PATCH'}
          fetchData={['name_occupation', 'salary_occupation', 'status_occupation']}
          getOneUrl={getSingleUrl}
          idFetchData="value_occupation"
          idToUpdate={selectedOccupationId}
          updateOneUrl={updateOneUrl}
          onSubmitUpdate={onSubmitUpdate}
          handleModalUpdate={handleModalUpdate}
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
            keys={['name_occupation', 'salary_occupation']}
            status_name={['id_occupation', 'status_occupation']}
            handleEdit={handleModalUpdate}
            handleDelete={handleDelete}
            fetchUrl={toggleStatus}
            onStatusToggle={onStatusToggle}
            selectedOccupationId={selectedOccupationId}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Occupation;
