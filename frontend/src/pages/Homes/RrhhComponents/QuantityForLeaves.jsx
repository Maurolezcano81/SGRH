import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const QuantityForLeaves = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [dataDismiss, setDataDismiss] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUANTITY_FOR_LEAVES}`;

    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256); // Valor para el rojo
        const g = Math.floor(Math.random() * 256); // Valor para el verde
        const b = Math.floor(Math.random() * 256); // Valor para el azul
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
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

        const labels = dataDismiss.map((item) => item.name_tol);

        const dataPoints = dataDismiss.map((item) => item.total_days || 0);

        const backgroundColors = dataDismiss.map(() => generateRandomColor());
        const borderColors = backgroundColors.map(color => color.replace('1', '1'));

        const datasets = [
            {
                label: 'Cantidad de bajas por razón',
                data: dataPoints, 
                backgroundColor: backgroundColors,
                borderColor: borderColors, 
                borderWidth: 2,
            },
        ];

        if (chartInstance.current) {
            chartInstance.current.data.labels = labels;  // Actualizamos las etiquetas
            chartInstance.current.data.datasets = datasets;  // Actualizamos el dataset
            chartInstance.current.update();
        } else {
            // Si no existe, creamos una nueva instancia del gráfico
            chartInstance.current = new Chart(ctx, {
                type: 'bar',  // Gráfico de barras
                data: {
                    labels: labels,  // Las etiquetas que corresponden a cada barra
                    datasets: datasets,  // El dataset con los datos
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',  // Las barras estarán en el eje Y
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90,
                                minRotation: 45,
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            display: false
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
    }, [dataDismiss]);

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Total de Ausencias según tipo de Licencia</h2>

            <div className="quantity_dismiss chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>

            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default QuantityForLeaves;
