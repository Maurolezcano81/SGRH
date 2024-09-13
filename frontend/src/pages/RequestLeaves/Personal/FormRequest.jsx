import { useEffect, useState } from "react";
import ButtonRed from "../../../components/ButtonRed";
import ButtonBlue from "../../../components/ButtonBlue";
import ButtonWhiteOutlineBlack from "../../../components/Buttons/ButtonWhiteOutlineBlack";
import useAuth from "../../../hooks/useAuth";

const FormRequest = ({ handleCloseFormRequest, handleStatusUpdated }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [typesOfLeave, setTypesOfLeave] = useState([]);
  const [dataForm, setDataForm] = useState({
    tol_fk: "",
    reason_lr: "",
    start_lr: "",
    end_lr: "",
  });
  const [pictures, setPictures] = useState([]);

  const { authData } = useAuth();
  const createOne = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_LEAVE_USER}`;
  const urlGetData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_TYPES_OF_LEAVE}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchResponse = await fetch(urlGetData, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          }
        });
        const formatData = await fetchResponse.json();
        if (fetchResponse.status === 403) {
          console.log('error: ', formatData.message);
        }
        setTypesOfLeave(formatData.queryResponse);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [authData.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleImageChange = (index, e) => {
    const { files } = e.target;
    const updatedPictures = [...pictures];
    if (files && files[0]) {
      updatedPictures[index] = files[0];
      setPictures(updatedPictures);
    }
  };

  const addImageField = () => {
    setPictures([...pictures, null]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!dataForm.start_lr || !dataForm.end_lr) {
      setErrorMessage("Las fechas de inicio y fin son obligatorias.");
      return;
    }
  
    if (new Date(dataForm.start_lr) > new Date(dataForm.end_lr)) {
      setErrorMessage("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }
  
    const formData = new FormData();
    formData.append('tol_fk', dataForm.tol_fk);
    formData.append('reason_lr', dataForm.reason_lr);
    formData.append('start_lr', dataForm.start_lr);
    formData.append('end_lr', dataForm.end_lr);
  
    pictures.forEach((pic) => {
      if (pic) {
        formData.append('pictures', pic, pic.name);
      }
    });
  
    try {
      const response = await fetch(createOne, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${authData.token}`,
        },
        body: formData
      });
  
      const dataFormatted = await response.json();
  
      if (response.status === 403) {
        setErrorMessage(dataFormatted.message);
      } else {
        setSuccessMessage(dataFormatted.message);
        setErrorMessage('');
        handleStatusUpdated();
      }
    } catch (error) {
      setErrorMessage('Error al enviar la solicitud.');
      console.error(error);
    }
  };

  return (
    <form className="form__request__container" onSubmit={handleSubmit}>
      <div className="form__request__title">
        <h2>Formulario para solicitud de capacitación</h2>
        <span>Rellene el siguiente formulario para solicitar una capacitación trate de ser lo más específico posible.</span>
      </div>
      <div className="form__request__body">
        <div className="form__request__body__title">
          <div>
            <label htmlFor="tol_fk">Ingrese el tipo de licencia:</label>
            <select name="tol_fk" onChange={handleChange} className="input__form__div__input">
              <option value="">Selecciona una respuesta</option>
              {typesOfLeave.map(status => (
                <option key={status.id_tol} value={status.id_tol}>{status.name_tol}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="start_lr">Fecha de inicio de licencia:</label>
            <input
              type="date"
              onChange={handleChange}
              className="input__form__div__input"
              name="start_lr"
            />
          </div>

          <div>
            <label htmlFor="end_lr">Fecha de fin de licencia:</label>
            <input
              type="date"
              onChange={handleChange}
              className="input__form__div__input"
              name="end_lr"
            />
          </div>

          <div>
            <label htmlFor="reason_lr">Ingrese una descripción:</label>
            <textarea
              onChange={handleChange}
              className="input__form__div__input"
              name="reason_lr"
            />
          </div>

          <div>
            <label>Agregar imágenes:</label>
            {pictures.map((pic, index) => (
              <div key={index}>
                <input
                  className="input__form__div__input"
                  type="file"
                  name="value_alr"
                  onChange={(e) => handleImageChange(index, e)}
                />
              </div>
            ))}
            <ButtonWhiteOutlineBlack title="Agregar Imagen +" onClick={addImageField} />
          </div>
        </div>
        <div className="form__request__buttons">
          <ButtonRed title="Cerrar" onClick={handleCloseFormRequest} />
          <ButtonBlue title="Enviar Solicitud" type="submit" />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </form>
  );
};

export default FormRequest;
