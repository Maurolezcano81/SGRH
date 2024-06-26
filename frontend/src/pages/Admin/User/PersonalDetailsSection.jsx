import { useState, useEffect } from 'react';
import ErrorMessage from '../../../components/Alerts/ErrorMessage';
import useAuth from '../../../hooks/useAuth';

const PersonalDetailsSection = ({
  setEntityData,
  setContactEntityData,
  setDocumentEntityData,
  error,
  setCriticalErrorToggle,
  setCriticalErrorMessagge,
}) => {
  const [listTypeDocument, setListTypeDocument] = useState([]);
  const [listSex, setListSex] = useState([]);
  const [listNacionality, setListNacionality] = useState([]);
  const [listContact, setListContact] = useState([]);

  const API_URLS = [
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/documents`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/sexs`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/nacionalities`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/contacts`,
  ];

  const { authData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authData.token) {
          const responses = await Promise.all(
            API_URLS.map((url) =>
              fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authData.token}`,
                },
              })
            )
          );

          const datas = await Promise.all(responses.map((response) => response.json()));

          const [documentsData, sexsData, nacionalitiesData, contactsData] = datas;

          const activeSexs = sexsData.queryResponse.filter((sex) => sex.status_sex === 1);
          const activeTypeDocuments = documentsData.queryResponse.filter((document) => document.status_document === 1);
          const activeNacionalities = nacionalitiesData.queryResponse.filter(
            (nacionality) => nacionality.status_nacionality === 1
          );
          const activeContacts = contactsData.queryResponse.filter((contact) => contact.status_contact === 1);

          setListTypeDocument(activeTypeDocuments || []);
          setListSex(activeSexs || []);
          setListNacionality(activeNacionalities || []);
          setListContact(activeContacts || []);
        }
      } catch (error) {
        setCriticalErrorToggle(true);
        setCriticalErrorMessagge('Error al obtener la informacion para completar los datos de la persona');
      }
    };

    fetchData();
  }, [authData.token]);

  const handleChangeEntityData = (e) => {
    const { name, value } = e.target;
    setEntityData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeContactEntityData = (e) => {
    const { name, value } = e.target;
    setContactEntityData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeDocumentEntityData = (e) => {
    const { name, value } = e.target;
    setDocumentEntityData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container__section">
      <div className="container__title-form">
        <h2>Datos Personales</h2>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="name_entity">
          Nombre:
        </label>
        <input
          className="input__form__div__input"
          type="text"
          name="name_entity"
          id="name_entity"
          placeholder="Nombre"
          onChange={handleChangeEntityData}
        />
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="lastname_entity">
          Apellido:
        </label>
        <input
          className="input__form__div__input"
          type="text"
          name="lastname_entity"
          id="lastname_entity"
          placeholder="Apellido"
          onChange={handleChangeEntityData}
        />
      </div>

      <div className="input__form__div">
        <select className="input__form__div__label" name="document_fk" onChange={handleChangeDocumentEntityData}>
          <option value="">Tipo de documento</option>
          {listTypeDocument.map((document) => (
            <option key={document.id_document} value={document.id_document}>
              {document.name_document}
            </option>
          ))}
        </select>
        <input
          placeholder="Documento"
          className="input__form__div__input"
          type="text"
          name="value_ed"
          onChange={handleChangeDocumentEntityData}
        />
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="nacionality_fk">
          Nacionalidad:
        </label>
        <select
          className="input__form__div__input"
          name="nacionality_fk"
          id="nacionality_fk"
          onChange={handleChangeEntityData}
        >
          <option value="">Seleccione su nacionalidad</option>
          {listNacionality.map((nacionality) => (
            <option key={nacionality.id_nacionality} value={nacionality.id_nacionality}>
              {nacionality.name_nacionality}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="sex_fk">
          Sexo:
        </label>
        <select className="input__form__div__input" name="sex_fk" id="sex_fk" onChange={handleChangeEntityData}>
          <option value="">Seleccione el sexo</option>
          {listSex.map((sex) => (
            <option key={sex.id_sex} value={sex.id_sex}>
              {sex.name_sex}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="date_birth_entity">
          Fecha de Nacimiento:
        </label>
        <input
          className="input__form__div__input"
          type="date"
          name="date_birth_entity"
          id="date_birth_entity"
          placeholder="Ingrese la fecha de nacimiento"
          onChange={handleChangeEntityData}
        />
      </div>

      <div className="input__form__div">
        <select className="input__form__div__label" name="contact_fk" onChange={handleChangeContactEntityData}>
          <option value="">Tipo de Contacto</option>
          {listContact.map((contact) => (
            <option key={contact.id_contact} value={contact.id_contact}>
              {contact.name_contact}
            </option>
          ))}
        </select>
        <input
          placeholder="Introduzca el numero"
          className="input__form__div__input"
          type="text"
          name="value_ec"
          onChange={handleChangeContactEntityData}
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default PersonalDetailsSection;
