import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';

const PersonalDetailsSection = ({ setEntityData }) => {
  const [listTypeDocument, setListTypeDocument] = useState([]);
  const [listSex, setListSex] = useState([]);
  const [listNacionality, setListNacionality] = useState([]);

  const { authData } = useAuth();

  const API_URLS = [
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/documents`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/sexs`,
    `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/admin/nacionalities`,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentsResponse, sexsResponse, nacionalitiesResponse] = await Promise.all(
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

        if (documentsResponse.status === 403 || sexsResponse.status === 403 || nacionalitiesResponse.status === 403) {
          alert('Error al obtener los datos');
          return;
        }

        const [documentsData, sexsData, nacionalitiesData] = await Promise.all([
          documentsResponse.json(),
          sexsResponse.json(),
          nacionalitiesResponse.json(),
        ]);

        setListTypeDocument(documentsData.queryResponse || []);
        setListSex(sexsData.queryResponse || []);
        setListNacionality(nacionalitiesData.queryResponse || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authData.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntityData((prevState) => ({
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
        <label className="input__form__div__label" htmlFor="name_entity">Nombre:</label>
        <input className="input__form__div__input" type="text" name="name_entity" placeholder="Ingrese el nombre" onChange={handleChange} />
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="lastname">Apellido:</label>
        <input className="input__form__div__input" type="text" name="lastname_entity" placeholder="Ingrese el apellido" onChange={handleChange} />
      </div>

      <div className="input__form__div">
        <select className="input__form__div__label" name="documentId" onChange={handleChange}>
          <option value="">Tipo de documento</option>
          {listTypeDocument.map((document) => (
            <option key={document.id_document} value={document.id_document}>
              {document.name_document}
            </option>
          ))}
        </select>
        <input className="input__form__div__input" type="text" name="documentData" onChange={handleChange} />
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="nacionality">Nacionalidad:</label>
        <select className="input__form__div__input" name="nacionalityId" onChange={handleChange}>
          <option value="">Seleccione su nacionalidad</option>
          {listNacionality.map((nacionality) => (
            <option key={nacionality.id_nacionality} value={nacionality.id_nacionality}>
              {nacionality.name_nacionality}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="sex">Sexo:</label>
        <select className="input__form__div__input" name="sexId" onChange={handleChange}>
          <option value="">Seleccione el sexo</option>
          {listSex.map((sex) => (
            <option key={sex.id_sex} value={sex.id_sex}>
              {sex.name_sex}
            </option>
          ))}
        </select>
      </div>

      <div className="input__form__div">
        <label className="input__form__div__label" htmlFor="birthDate">Fecha de Nacimiento:</label>
        <input className="input__form__div__input" type="date" name="birthDate" placeholder="Ingrese la fecha de nacimiento" onChange={handleChange} />
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
