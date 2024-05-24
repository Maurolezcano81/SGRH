import { useEffect, useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import PreferencesTableHeader from '../../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../../components/Table/TablePreferences/PreferencesBodyRow';

const Sex = () => {
  const [sexs, setSexs] = useState([]);

  const { authData } = useAuth();

  const getSexsUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/sexs`;

  useEffect(() => {
    const fetchSexs = async () => {
      try {
        const fetchResponse = await fetch(getSexsUrl, {
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

        setSexs(data.queryResponse);
      } catch (error) {
        console.error('Error al obtener las ocupaciones');
      }
    };

    fetchSexs();
  }, []);


  const handleEdit = (item) => {
    // Lógica para editar el elemento
    console.log('Editar:', item);
  };

  const handleDelete = (item) => {
    // Lógica para eliminar el elemento
    console.log('Eliminar:', item);
  };
  return (
    <div className="preference__container">
      <div className="preference-title">
        <h4>Sexo</h4>
        <button>Agregar Nuevo</button>
      </div>

      <table className="table__preference">
        <thead className="table__preference__head">
          <PreferencesTableHeader keys={['Nombre', 'Estado', 'Acciones']} />
        </thead>
        <tbody className="table__preference__body">
          <PreferencesBodyRow
            items={sexs}
            keys={['name_sex', 'status_sex']}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Sex;
