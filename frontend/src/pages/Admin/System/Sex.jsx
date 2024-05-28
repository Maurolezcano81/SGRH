import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import PreferencesTableHeader from '../../../components/Table/TablePreferences/PreferencesTableHeader';
import PreferencesBodyRow from '../../../components/Table/TablePreferences/PreferencesBodyRow';
import PreferenceTitle from './PreferenceTitle';
import ModalAdd from '../ModalAdd';

const Sex = () => {
  const getSexsUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/sexs`;
  const postCreateSexUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/sex`;

  const [sexs, setSexs] = useState([]);
  const [sexsFormatted, setSexsFormatted] = useState([]);
  const [toggleModalAdd, setToggleModalAdd] = useState(false);
  const [newFieldAdded, setNewFieldAdded] = useState(false);

  
  const handleAddField = () =>{
    setNewFieldAdded(!newFieldAdded)
  }

  const { authData } = useAuth();

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
          throw new Error('Ha ocurrido un error al obtener los tipos de sexo');
        }

        const data = await fetchResponse.json();

        setSexs(data.queryResponse);
        formatSexs(data.queryResponse);
      } catch (error) {
        console.error('Error al obtener los tipos de sexo', error);
      }
    };

    fetchSexs();
  }, [authData.token, newFieldAdded]);

  const formatSexs = (sexs) => {
    const formatted = sexs.map((sex) => ({
      ...sex,
    }));
    setSexsFormatted(formatted);
  };

  const onSubmitCreate = (newItem) => {
    const newSexs = [...sexs, newItem];
    setSexs(newSexs);
    formatSexs(newSexs);
    handleAddField();
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

  return (
    <div className="preference__container">
      <PreferenceTitle title="Sexo" handleModalAdd={handleModalAdd} />
      {toggleModalAdd && (
        <ModalAdd
          labels={['Nombre']}
          placeholders={['Ingrese nombre']}
          method={'POST'}
          fetchData={['name_sex']}
          urlCreate={postCreateSexUrl}
          onSubmitCreate={onSubmitCreate}
          handleModalAdd={handleModalAdd}
        />
      )}

      <table className="table__preference">
        <thead className="table__preference__head">
          <tr>
            <PreferencesTableHeader keys={['Nombre', 'Estado', 'Acciones']} />
          </tr>
        </thead>
        <tbody className="table__preference__body">
          <PreferencesBodyRow
            items={sexsFormatted}
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
