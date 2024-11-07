import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const ReasonDismiss = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [dataDismiss, setDataDismiss] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUANTITY_REASON_DISMISS}`;

    // Función para generar un color aleatorio
    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256); // Valor para el rojo
        const g = Math.floor(Math.random() * 256); // Valor para el verde
        const b = Math.floor(Math.random() * 256); // Valor para el azul
        return `rgba(${r}, ${g}, ${b}, 0.6)`; // Color aleatorio con opacidad 0.6
    };

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const fetchResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({}), 
                });

                const dataFormatted = await fetchResponse.json();

                if (fetchResponse.status === 403) {
                    setErrorMessage(dataFormatted.message);
                } else {
                    setDataDismiss(dataFormatted.queryResponse);
                }
            } catch (error) {
                setErrorMessage('Error fetching data');
            }
        };

        fetchRequest();
    }, [token]);

    useEffect(() => {
        if (dataDismiss.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        const labels = dataDismiss.map((item) => item.description_tot);
        const dataPoints = dataDismiss.map((item) => item.total_terminations || 0);

        const backgroundColors = labels.map(() => generateRandomColor());
        const borderColors = backgroundColors.map(color => color.replace('1', '1'));

        if (chartInstance.current) {
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets[0].data = dataPoints;
            chartInstance.current.data.datasets[0].backgroundColor = backgroundColors;
            chartInstance.current.data.datasets[0].borderColor = borderColors;
            chartInstance.current.update();
        } else {
            chartInstance.current = new Chart(ctx, {
                type: 'pie', 
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cantidad de bajas por razón',
                            data: dataPoints,
                            backgroundColor: backgroundColors,
                            borderColor: borderColors,
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    const label = tooltipItem.label;
                                    const value = tooltipItem.raw;
                                    return `${label}: ${value}`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [dataDismiss]); // Actualizar solo cuando `dataDismiss` cambie

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Cantidades de Despidos por Tipo</h2>

            <div className="quantity_dismiss chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>

            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default ReasonDismiss;
