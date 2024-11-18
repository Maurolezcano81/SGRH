import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir
import useAuth from '../../../../../hooks/useAuth';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de importar la extensión

import logo from '../../../../../assets/LOGO.png'
import ButtonBlue from '../../../../../components/ButtonBlue';
import ButtonRed from '../../../../../components/ButtonRed';
const ButtonDismissPercent = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [maxAndMinYears, setMaxAndMinYears] = useState({});
    const [queryResponse, setQueryResponse] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { authData } = useAuth();
    const urlYears = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_SUMMARY_YEARS_PERCENT_OF_DISMISS_BY_YEAR}`;
    const urlData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_SUMMARY_PERCENT_OF_DISMISS_BY_YEAR}`;

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const generateReport = () => {
        if (selectedYear) {
            fetchData();
            toggleModal();
        } else {
            alert('Por favor selecciona un año');
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(urlData, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    year: selectedYear,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const list = await response.json();
            setQueryResponse(list.queryResponse || []);
        } catch (error) {
            setErrorMessage("Error fetching data: " + error.message);
        }
    };

    const generateYearOptions = () => {
        const years = [];
        const { min, max } = maxAndMinYears;

        if (min && max) {
            for (let year = min; year <= max; year++) {
                years.push(year);
            }
        }

        return years;
    };

    const generatePDF = () => {
        const now = new Date();

        const day = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        const hour = now.getHours();
        const minutes = now.getMinutes();


        if (queryResponse.length === 0) {
            alert('No hay datos para generar el informe');
            return;
        }

        const doc = new jsPDF();

        doc.addImage(logo, 'PNG', 150, 5, 50, 10); // x, y, w, h

        doc.setFontSize(12);
        doc.text(`Reporte de Despidos - Año ${selectedYear}`, 10, 20); // x, y

        doc.setFontSize(8);
        doc.text("Este es un informe detallado de los despidos para el año seleccionado.", 10, 40);
        doc.text("Este informe muestra las estadísticas de despidos mes a mes.", 10, 50);
        doc.text(`Reporte generado el: ${day}/${month}/${year} a las ${hour}:${minutes}`, 10, 60)

        doc.autoTable({
            head: [['Mes', 'Despidos', 'Total Empleados', 'Total Restantes', 'Porcentaje Despidos']],
            body: queryResponse.map(item => [
                item.mes,
                item.despidos,
                item.total_empleados,
                item.total_restantes,
                `${Number(item.porcentaje_despidos).toFixed(2)}%`,
            ]),
            startY: 20,
            columnStyles: {
            },
            theme: 'grid',
            startY: 80,    
            headStyles: {
                fillColor: "#0c8ce9",
                textColor: "#fafafa", // Texto negro
                fontStyle: 'bold', // Negrita en la cabecera
                lineWidth: 0.5, // Grosor del borde de la cabecera
                halign: 'center', // Alineación del texto de la cabecera
            }
        });

        doc.save(`Reporte_Despidos_${selectedYear}.pdf`);
    };
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await fetch(urlYears, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }

                const list = await response.json();
                setMaxAndMinYears(list.queryResponse);
            } catch (error) {
                console.error("Error al obtener los años:", error);
            }
        };

        fetchYears();
    }, [authData.token]);

    return (
        <div className='report__container'>

            <div className='report__title__container'>

                <svg xmlns="http://www.w3.org/2000/svg"
                    width="3rem"
                    height="3rem"
                    viewBox="0 0 32 32">
                    <path fill="#0c8ce9"
                        d="M10 18h8v2h-8zm0-5h12v2H10zm0 10h5v2h-5z" />
                    <path
                        fill="#0c8ce9"
                        d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z" />
                </svg>

                <button onClick={toggleModal} className='report__button__title'>Despidos por Año</button>
            </div>
            {showModal && (
                <div className="report__info__container">
                    <div className="report__buttons__and__select__container">
                        <h2>Selecciona el Año</h2>

                        <select className='dashboard__option__select__full' value={selectedYear} onChange={handleYearChange}>
                            <option value="">Seleccione un año</option>
                            {generateYearOptions().map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        <ButtonBlue
                            onClick={generateReport}
                            title={"Generar Informe"}

                        />

                        <ButtonRed
                            onClick={toggleModal}
                            title={"Cerrar"}
                        />

                    </div>
                </div>
            )}

            {queryResponse.length > 0 && (
                <div className='report__buttons__container__post__select'>

                    <ButtonBlue
                        onClick={generatePDF}
                        title={"Descargar Reporte en PDF"}
                    />
                    <ButtonRed
                        onClick={() => setQueryResponse([])}
                        title={"Volver"}
                    />
                </div>
            )
            }

            {errorMessage && <p>{errorMessage}</p>}
        </div >
    );
};

export default ButtonDismissPercent;
