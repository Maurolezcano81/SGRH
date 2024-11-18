import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir
import useAuth from '../../../../../hooks/useAuth';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de importar la extensión

import logo from '../../../../../assets/LOGO.png'
import ButtonBlue from '../../../../../components/ButtonBlue';
import ButtonRed from '../../../../../components/ButtonRed';
const ButtonExpensesByDepartments = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [queryResponse, setQueryResponse] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { authData } = useAuth();
    const urlData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_SUMMARY_EXPENSES_BY_DEPARTMENTS}`;

    const toggleModal = () => {
        setShowModal(!showModal);
    };


    const generateReport = () => {
        fetchData();
        toggleModal();
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
        doc.text(`Gastos por Departamentos`, 10, 20); // x, y

        doc.setFontSize(8);
        doc.text("Este es un informe donde se muestran los costos asignados a cada departamento", 10, 40);
        doc.text("Esto proporciona una visión clara del impacto financiero de cada departamento en el presupuesto total de la empresa.", 10, 50);
        doc.text(`Reporte generado el: ${day}/${month}/${year} a las ${hour}:${minutes}`, 10, 60)

        doc.setFontSize(10);
        doc.text(`Costos Totales: ${queryResponse[0].total_company_costs}`, 10, 70)


        doc.autoTable({
            head: [['Departamento', 'Salario Total', "Porcentaje"]],
            body: queryResponse.map(item => [
                item.name_department,
                item.total_salary,
                `$${Number(item.percentage).toFixed(2)}%`,
            ]),
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

        doc.save(`Costos_Totales_por_Departamento.pdf`);
    };

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

                <button onClick={toggleModal} className='report__button__title'>Costos Totales Por Departamentos</button>
            </div>
            {showModal && (
                <div className="report__info__container">
                    <div className="report__buttons__and__select__container">

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

export default ButtonExpensesByDepartments;
