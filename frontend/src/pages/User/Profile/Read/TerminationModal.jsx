import { useState, useEffect } from 'react';
import ErrorMessage from '../../../../components/Alerts/ErrorMessage';
import ButtonBlue from '../../../../components/ButtonBlue';
import ButtonRed from '../../../../components/ButtonRed';
import useAuth from '../../../../hooks/useAuth';
const TerminationModal = ({
    backButtonAction,
    idEmployee,
    onSubmitDeleteAction,
    messageToDelete = "¿Quieres eliminar este registro? Al aceptar no se puede recuperar la informacion",
    textButtonRed = "Eliminar",
    updateProfile
}) => {
    const [message, setMessage] = useState('');
    const [type_of_termination, setType_of_termination] = useState(null);
    const [arrayTots, setArrayTots] = useState([]);

    const { authData } = useAuth();

    const handleSubmit = async () => {
        try {
            const fetchResponse = await fetch(dismissUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    tot_fk: type_of_termination,
                    idEmployee: idEmployee,
                }),
            });

            const dataFormatted = await fetchResponse.json();

            if (!fetchResponse.ok) {
                return setMessage(dataFormatted.message);
            }

            if (fetchResponse.status != 403) {
                return setMessage(dataFormatted.message);
            }
            onSubmitDeleteAction();
            updateProfile();
        } catch (error) {
            console.log('catch' + error.message);
        }
    };

    const getAllTot = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_TYPE_OF_TERMINATION}`

    const dismissUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.C_DISMISS_TERMINATION}`



    useEffect(() => {

        const getAllForSelect = async () => {

            const fetchRequest = await fetch(getAllTot, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            })


            const formattedData = await fetchRequest.json()
            if (fetchRequest.status != 200) {
                setArrayTots([]);
            }

            console.log(formattedData)
            setArrayTots(formattedData.queryResponse);
        }

        getAllForSelect()
    }, [authData])

    const handleTotChange = (e) => {
        console.log(e.target.value);
        setType_of_termination(e.target.value)
    }

    return (
        <div className="alert__background__black">
            <div className="alert__container">
                <div className="alert__header modal__delete">
                    <p>{messageToDelete}</p>
                </div>
                <div className="modal__delete__message">{message}</div>


                <div className="input__form__div">
                    <label className='input__form__div__label' htmlFor="id_tot">Motivo de Baja:</label>
                    {(
                        <select
                            className='input__form__div__input'
                            name='id_tot'
                            onChange={(e) => handleTotChange(e)}
                        >
                            <option value="0">{"Ingrese un motivo"}</option>
                            {arrayTots.map((tot) => (
                                <option key={tot.id_tot} value={tot.id_tot}>
                                    {tot.description_tot}
                                </option>
                            ))}
                        </select>
                    )}
                </div>


                <div className="alert__footer modal__delete">
                    <ButtonRed onClick={handleSubmit} title={textButtonRed} />
                    <ButtonBlue onClick={() => backButtonAction()} title={'Volver'} />
                </div>
            </div>
        </div>
    );
};

export default TerminationModal;
