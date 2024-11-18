import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const LeaveOnPeriodTimes = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState([]);
    const [minAndMaxDates, setMinAndMaxDates] = useState({});

    const quantityDismissUrl = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUANTITY_FOR_LEAVES_ON_A_PERIOD}`;

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!startDate || !endDate) {
                const today = new Date();
                const currentMonth = today.getMonth();
                const year = today.getFullYear();

                const firstDayOfMonth = new Date(year, currentMonth, 1);
                const lastDayOfMonth = new Date(year, currentMonth + 1, 0);

                setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
                setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
            }

            try {
                const response = await fetch(quantityDismissUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        startDate,
                        endDate,
                    }),
                });

                const dataFormatted = await response.json();

                if (!response.ok) {
                    setErrorMessage(dataFormatted.message || 'Error al obtener datos');
                } else {
                    setErrorMessage("");
                    setData(dataFormatted.queryResponse);
                    setMinAndMaxDates(dataFormatted.minAndMaxYears[0]);
                }
            } catch (error) {
                setErrorMessage('Error al obtener datos del servidor.');
                console.error(error);
            }
        };

        fetchData();
    }, [startDate, endDate, token]);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const labels = data.map((item) => item.month_name);
        const dataPointsLicenses = data.map((item) => item.total_licenses);
        const dataPointsDays = data.map((item) => item.total_days);

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Total de Licencias',
                        data: dataPointsLicenses,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const totalLicenses = context.raw;
                                const totalDays = dataPointsDays[context.dataIndex];
                                return [
                                    `Total de Licencias: ${totalLicenses}`,
                                    `Total de Días: ${totalDays}`,
                                ];
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [data]);

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Cantidad de Licencias por Tipo</h2>

            <div className="dashboard__options__container">
                <div className="dashboard__option__container">
                    <label className="dashboard__option__label" htmlFor="startDate">
                        Fecha de inicio:
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        className="dashboard__option__input"
                        value={startDate}
                        onChange={handleStartDateChange}
                        min={minAndMaxDates.earliest_start || ''}
                        max={minAndMaxDates.latest_end || ''}
                    />
                </div>
                <div className="dashboard__option__container">
                    <label className="dashboard__option__label" htmlFor="endDate">
                        Fecha de fin:
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        className="dashboard__option__input"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={minAndMaxDates.earliest_start || ''}
                        max={minAndMaxDates.latest_end || ''}
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>

            <div className="quantity_dismiss chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>
        </div>
    );
};

export default LeaveOnPeriodTimes;
