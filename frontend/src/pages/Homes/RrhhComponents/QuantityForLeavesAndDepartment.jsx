import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const QuantityForLeavesAndDepartment = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [dataDismiss, setDataDismiss] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUANTITY_FOR_LEAVES_AND_DEPARTMENT}`;

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
    
        // Agrupar los datos por departamento y tipo de licencia
        const departments = {};  // Objeto para almacenar los días por departamento y tipo de licencia
        const licenseTypes = new Set();  // Set para almacenar tipos de licencia únicos
    
        dataDismiss.forEach(item => {
            const { name_department, type_of_leave, total_days } = item;
    
            // Inicializar el objeto de departamento si no existe
            if (!departments[name_department]) {
                departments[name_department] = {};
            }
    
            departments[name_department][type_of_leave] = parseInt(total_days) || 0;
    
            licenseTypes.add(type_of_leave);
        });
    
        const labels = Object.keys(departments);  
        const typesOfLeave = Array.from(licenseTypes);
    
        const datasets = typesOfLeave.map(type => {
            const dataPoints = labels.map(department => {
                return departments[department][type] || 0;  
            });
    
            const backgroundColors = dataPoints.map(() => generateRandomColor());
            const borderColors = backgroundColors.map(color => color.replace('1', '1')); 
    
            return {
                label: type,  
                data: dataPoints,  
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                stack: 'stack1',
            };
        });
    
        if (chartInstance.current) {
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets = datasets;
            chartInstance.current.update();
        } else {
            chartInstance.current = new Chart(ctx, {
                type: 'bar',  
                data: {
                    labels: labels,  
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'x', 
                    scales: {
                        x: {
                            stacked: true, 
                            title: {
                                display: true,
                                text: 'Departamentos',  
                            },
                        },
                        y: {
                            stacked: true,  
                            title: {
                                display: true,
                                text: 'Total de Días', 
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'top', 
                            display: true,  
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    const label = tooltipItem.dataset.label;
                                    const value = tooltipItem.raw;
                                    return `${label}: ${value} días`; 
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
            <h2 className="bold">Total de Ausencias Por Departamento</h2>

            <div className="quantity_dismiss chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>

            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default QuantityForLeavesAndDepartment;
