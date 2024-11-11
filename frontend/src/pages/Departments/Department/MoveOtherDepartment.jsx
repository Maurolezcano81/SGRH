import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import ButtonBlue from '../../../components/ButtonBlue';
import ButtonRed from '../../../components/ButtonRed';

const MoveOtherDepartment = ({ personal, department, updateProfile, handleSingleCloseModal }) => {
    const [listDepartments, setListDepartments] = useState([]);
    const [listOccupations, setListOccupations] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(personal.id_department || '');
    const [selectedOccupation, setSelectedOccupation] = useState(personal.occupation_fk || '');
    const [errorMessage, setErrorMessage] = useState('');

    const { authData } = useAuth();

    const getDepartments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}`;
    const getOccupations = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_OCCUPATION_ACTIVES}`;
    const update = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.R_DEPARTMENT_INSERT_EMPLOYEE}`;

    useEffect(() => {
        const fetchOccupations = async () => {
            if (authData.token) {
                try {
                    const fetchResponse = await fetch(getOccupations, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authData.token}`,
                        },
                    });

                    if (!fetchResponse.ok) {
                        return;
                    }

                    const occupations = await fetchResponse.json();
                    const occupationsActives = occupations.list.filter((occupation) => occupation.status_occupation === 1);
                    setListOccupations(occupationsActives || []);
                } catch (error) {
                    console.error(error.message);
                }
            }
        };

        const fetchDepartments = async () => {
            if (authData.token) {
                try {
                    const fetchResponse = await fetch(getDepartments, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authData.token}`,
                        },
                    });

                    if (!fetchResponse.ok) {
                        return;
                    }

                    const departments = await fetchResponse.json();
                    const departmentsActives = departments.list.filter((department) => department.status_department === 1);
                    setListDepartments(departmentsActives || []);
                } catch (error) {
                    console.error(error.message);
                }
            }
        };

        fetchOccupations();
        fetchDepartments();
    }, [authData.token]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const dataToUpdate = {
            id_edo: personal.id_edo,
            entity_fk: personal.entity_fk,
            department_fk: selectedDepartment,
            occupation_fk: selectedOccupation,
        };

        try {
            const response = await fetch(update, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            const dataFormatted = await response.json();

            if (response.status === 403) {
                setErrorMessage(dataFormatted.message);
            } else {
                updateProfile();
                handleSingleCloseModal();
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="alert__background__black">
                <div className="preferences__modal__container">
                    <div className="preferences__modal__content">
                        <h2>Mover a otro departamento</h2>
                        <form onSubmit={handleFormSubmit} className="preferences__modal__content-update">
                            <div className="input__form__div">
                                <label className="input__form__div__label" htmlFor="department_fk">
                                    Mover a:
                                </label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="input__form__div__input"
                                    name="department_fk"
                                    id="department_fk"
                                >
                                    <option value="">Seleccione un departamento</option>
                                    {listDepartments.map((department) => (
                                        <option key={department.id_department} value={department.id_department}>
                                            {department.name_department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input__form__div">
                                <label className="input__form__div__label" htmlFor="occupation_fk">
                                    Puesto de trabajo:
                                </label>
                                <select
                                    value={selectedOccupation}
                                    onChange={(e) => setSelectedOccupation(e.target.value)}
                                    className="input__form__div__input"
                                    name="occupation_fk"
                                    id="occupation_fk"
                                >
                                    <option value="">Seleccione un puesto de trabajo</option>
                                    {listOccupations.map((occupation) => (
                                        <option key={occupation.id_occupation} value={occupation.id_occupation}>
                                            {occupation.name_occupation}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {errorMessage && (
                                <div className="preferences__modal__error">
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="preferences__modal__actions">
                                <ButtonRed title="Cancelar" onClick={handleSingleCloseModal} />
                                <ButtonBlue title="Guardar Cambios" type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MoveOtherDepartment;
