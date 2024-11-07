import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

const MoveOnDepartment = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [minAndMaxYears, setMinAndMaxYears] = useState({});
    const [years, setYears] = useState([]);

    const [selectedYear, setSelectedYear] = useState('2023');
    const [errorMessageSelectedYear, setErrorMessageSelectedYear] = useState('');
    const [dataDismiss, setDataDismiss] = useState([]);

    const handleSelectedYear = (e) => {
        setSelectedYear(e.target.value);
    };

    const [dataUpPersonal, setDataUpPersonal] = useState([]);

    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUANTITY_MOVEMENT_ON_DEPARTMENTS}`;

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const fetchResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        year: selectedYear,
                    }),
                });

                const dataFormatted = await fetchResponse.json();

                if (dataFormatted.minAndMaxYears && dataFormatted.minAndMaxYears[0]) {
                    const minAndMax = dataFormatted.minAndMaxYears[0];

                    const min = Math.min(
                        new Date(minAndMax.min_date_entry_employee).getFullYear(),
                        new Date(minAndMax.min_date_te).getFullYear()
                    );

                    const max = Math.max(
                        new Date(minAndMax.max_date_entry_employee).getFullYear(),
                        new Date(minAndMax.max_date_te).getFullYear()
                    );

                    setMinAndMaxYears({ min, max });
                } else {
                    console.error("minAndMaxYears no está definido en dataFormatted.");
                }

                if (fetchResponse.status === 403) {
                    setErrorMessageSelectedYear(dataFormatted.message);
                } else {
                    setDataDismiss(dataFormatted.queryResponse);  
                    setDataUpPersonal(dataFormatted.queryResponse); 
                }
            } catch (error) {
                setErrorMessageSelectedYear('Error fetching data');
            }
        };


        fetchRequest();
    }, [selectedYear, token]);

    useEffect(() => {
        if (minAndMaxYears.min && minAndMaxYears.max) {
            const yearRange = [];
            for (let year = minAndMaxYears.min; year <= minAndMaxYears.max; year++) {
                yearRange.push(year);
            }
            setYears(yearRange);
        }
    }, [minAndMaxYears]);
    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const labels = dataDismiss.map((item) => item.month_name);
        const dataPointsPrevYear = dataDismiss.map((item) => item.total_terminations || 0); // Asegura que tenga un valor
        const dataPointsSecondYear = dataUpPersonal.map((item) => item.total_entries || 0);

        if (chartInstance.current) {
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets[0].data = dataPointsPrevYear;
            chartInstance.current.data.datasets[1].data = dataPointsSecondYear;
            chartInstance.current.data.datasets[0].label = `Cantidad de bajas en ${selectedYear}`;
            chartInstance.current.data.datasets[1].label = `Cantidad de altas en ${selectedYear}`;
            chartInstance.current.update();
        } else {
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: `Cantidad de bajas en ${selectedYear}`,
                            data: dataPointsPrevYear,
                            borderColor: 'rgba(231, 76, 60, 1)',
                            borderWidth: 2,
                        },
                        {
                            label: `Cantidad de altas en ${selectedYear}`,
                            data: dataPointsSecondYear,
                            borderColor: 'rgba(52, 152, 219, 1)',
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
        }
    }, [dataDismiss, selectedYear, dataUpPersonal]);

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Tendencia de Rotación de Personal</h2>

            <div className='dashboard__options__container'>
                <div className="dashboard__option__container">
                    <label className='dashboard__option__label' htmlFor="selectedYear">Seleccione un año:</label>
                    <select className='dashboard__option__input' onChange={handleSelectedYear} name="selectedYear" id="selectedYear" value={selectedYear}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                {errorMessageSelectedYear && <p>{errorMessageSelectedYear}</p>}
            </div>

            <div className='quantity_dismiss chart__container'>
                <canvas ref={chartRef} className='chart' />
            </div>
        </div>
    );
};

export default MoveOnDepartment;
