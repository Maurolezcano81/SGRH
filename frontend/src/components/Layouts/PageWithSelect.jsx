import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import ButtonBlue from '../ButtonBlue';
import PreferencesTableHeader from '../Table/TablePreferences/PreferencesTableHeader';
import DeleteButton from '../Buttons/DeleteButton';
import ModalDelete from '../Modals/ModalDelete'; // Asegúrate de importar ModalDelete
import ListForAdd from '../Modals/ListForAdd';

const PageWithSelect = ({
  getOptions,
  getContentTable,
  tableFields,
  selectFields,
  nameFetchConditioned,
  deleteOne,
  field_name,
  setIdToGet
}) => {
  const [arrayWithOptions, setArrayWithOptions] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState('Seleccione un perfil');
  const [selectedOption, setSelectedOption] = useState('');
  const [arrayWithTableContainer, setArrayWithTableContainer] = useState([]);
  const [arrayWithTableContainFormatted, setArrayWithTableContainerFormatted] = useState([]);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const { authData } = useAuth();
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(getOptions, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setArrayWithOptions(data.list);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [authData, getOptions, arrayWithOptions]);

  useEffect(() => {
    if (selectedOption) {
      const fetchModules = async () => {
        try {
          const body = {
            [nameFetchConditioned]: selectedOption,
          };

          const response = await fetch(getContentTable, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authData.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          const data = await response.json();

          if (data.queryResponse.length === 0) {
            setArrayWithTableContainerFormatted([]);
            setNoDataMessage('No hay módulos en este perfil');
          } else {
            setArrayWithTableContainer(data.queryResponse)
            formatDataInTable(data.queryResponse);
          }
        } catch (error) {
          console.error('Error fetching modules:', error);
          setNoDataMessage('Error fetching modules');
        }
      };

      fetchModules();
    }
  }, [selectedOption, authData, getContentTable, nameFetchConditioned, modalDeleteIsOpen, isOpenModalAdd ]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setIdToGet(event.target.value)
  };

  const formatDataInTable = (array) => {
    const format = array.map((item) => ({
      ...item,
    }));
    setArrayWithTableContainerFormatted(format);
  };

  const handleUnbind = (itemId) => {
    setIdToDelete(itemId);
    setModalDeleteIsOpen(true);
  };

  const onSubmitDelete = async () => {
    setModalDeleteIsOpen(false);
  };

  const handleModalDelete = async () => {
    setModalDeleteIsOpen(!modalDeleteIsOpen);
    const updatedArray = arrayWithTableContainFormatted.filter((item) => item[tableFields.id] !== idToDelete);
    setArrayWithTableContainerFormatted(updatedArray);
  };

  const handleModalListForAdd = (e) => {
    setIsOpenModalAdd(!isOpenModalAdd);
  };


  return (
    <div className=''>
      <div className="section__header">
        <div className="section__header__container-select">
          <select className="input__form__div__input" onChange={handleSelectChange}>
            <option value="">Seleccione una opción</option>
            {arrayWithOptions.map((option) => (
              <option key={option[selectFields.id]} value={option[selectFields.id]}>
                {option[selectFields.name]}
              </option>
            ))}
          </select>
        </div>
        <div className="section__header__container-button">
          <ButtonBlue title={'Agregar Nuevo'} onClick={handleModalListForAdd} />
        </div>
      </div>

      {modalDeleteIsOpen && (
        <ModalDelete
          handleModalDelete={handleModalDelete}
          field_name={field_name}
          idToDelete={idToDelete}
          deleteOne={deleteOne}
          onSubmitDelete={onSubmitDelete}
        />
      )}

      {isOpenModalAdd && (
        <ListForAdd selectedProfile={selectedOption} handleModalListForAdd={handleModalListForAdd} ModulesBinded={arrayWithTableContainer} />
      )}
      <table className="section__table">
        <thead className="table__preference__head page__with__select">
          <tr>
            <PreferencesTableHeader keys={['Modulos', 'Acciones']} />
          </tr>
        </thead>
        <tbody className="table__preference__body page__with__select">
          {arrayWithTableContainFormatted.length > 0 ? (
            arrayWithTableContainFormatted.map((item, index) => (
              <tr key={index}>
                <td className="page__with__select__table__body-first">{item[tableFields.name]}</td>
                <td className="page__with__select__table__body-second">
                  <DeleteButton action={() => handleUnbind(item[tableFields.id])} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">{noDataMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PageWithSelect;
