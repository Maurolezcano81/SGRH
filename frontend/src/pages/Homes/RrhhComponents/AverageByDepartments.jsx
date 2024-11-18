import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ButtonBlue from "../../../components/ButtonBlue";

const AverageByDepartments = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [chartData, setChartData] = useState([]);
    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_AVERAGE_PERFORMANCE_FOR_DEPARTMENT}`;

    const fetchChartData = async () => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(),
            });
            const data = await response.json();

            if (response.status === 403) {
                setErrorMessage(data.message);
            } else {
                setChartData(data.queryResponse || []);
            }
        } catch (error) {
            setErrorMessage("Error fetching chart data");
        }
    };

    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256); 
        const b = Math.floor(Math.random() * 256); 
        return `rgba(${r}, ${g}, ${b}, 0.6)`; 
    };

    useEffect(() => {
        if (chartData.length === 0) return;

        const ctx = chartRef.current.getContext('2d');
        const labels = chartData.map(item => item.name_department);  
        const scores = chartData.map(item => item.average_score);   

        const backgroundColors = scores.map(() => generateRandomColor());  

        if (chartInstance.current) {
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets[0].data = scores;
            chartInstance.current.data.datasets[0].backgroundColor = backgroundColors;
            chartInstance.current.update();
        } else {
        
            chartInstance.current = new Chart(ctx, {
                type: 'bar',  
                data: {
                    labels: labels,  
                    datasets: [{
                        label: 'Promedio de Calificación',
                        data: scores,  
                        backgroundColor: backgroundColors,  
                        borderWidth: 1, 
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'x', 
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Departamentos',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Promedio de Calificación', 
                            },
                            min: 0, 
                            max: 10,  
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'false', 
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    const label = tooltipItem.dataset.label;
                                    const value = tooltipItem.raw;
                                    return `${label}: ${value} de promedio`; 
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [chartData]);  

    useEffect(() => {
        fetchChartData();
    }, [token]);

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Desempeño Promedio por Departamentos</h2>

            <div className="quantity_dismiss chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>

            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default AverageByDepartments;
