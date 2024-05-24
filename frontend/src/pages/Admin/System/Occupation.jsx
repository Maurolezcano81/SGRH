import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import PreferencesTableHeader from '../../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../../components/Table/TablePreferences/PreferencesBodyRow';
import PreferenceTitle from './PreferenceTitle';
import ModalAddTwoInputs from '../ModalAddTwoInputs';

const Occupation = () => {
  const [occupations, setOccupations] = useState([]);
  const [occupationsFormatted, setOccupationsFormatted] = useState([]);
  const [toggleModalAdd, setToggleModalAdd] = useState(false);

  const { authData } = useAuth();

  const getOccupationsUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupations`;
  const postCreateOccupationUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/occupation`;

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
  }, [authData.token]);

  const formatOccupations = (occupations) => {
    const formatted = occupations.map(occupation => ({
      ...occupation,
      salary_occupation: currencyFormatter(occupation.salary_occupation),
    }));
    setOccupationsFormatted(formatted);
  };

  const onSubmitCreate = (newItem) => {
    setOccupations([...occupations, newItem]);
    formatOccupations([...occupations, newItem]);
  };

  const handleEdit = (item) => {
    console.log('Editar:', item);
  };

  const handleDelete = (item) => {
    console.log('Eliminar:', item);
  };

  const handleModalAdd = () => {
    setToggleModalAdd(!toggleModalAdd);
  };

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
        <ModalAddTwoInputs
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
            <PreferencesTableHeader keys={['Nombre', 'Salario', 'Estado', 'Acciones']} />
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
