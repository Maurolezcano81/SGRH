import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

const QuantityDismiss = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [minAndMaxYears, setMinAndMaxYears] = useState({});
    const [years, setYears] = useState([]);

    const [prevYear, setPrevYear] = useState('2023');
    const [errorMessagePrevYear, setErrorMessagePrevYear] = useState('');
    const [dataPrevYear, setDataPrevYear] = useState([]);

    const handlePrevYear = (e) => {
        setPrevYear(e.target.value);
    };

    const [secondYear, setSecondYear] = useState('2024');
    const [errorMessageSecondYear, setErrorMessageSecondYear] = useState('');
    const [dataSecondYear, setDataSecondYear] = useState([]);

    const handleSecondYear = (e) => {
        setSecondYear(e.target.value);
    };

    const quantityDismiss = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUANTITY_DISMISS}`;

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const fetchResponse = await fetch(quantityDismiss, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        year: prevYear,
                    }),
                });

                const dataFormatted = await fetchResponse.json();

                if (fetchResponse.status === 403) {
                    setErrorMessagePrevYear(dataFormatted.message);
                } else {
                    setDataPrevYear(dataFormatted.queryResponse);
                    setMinAndMaxYears(dataFormatted.minAndMaxYears);
                }
            } catch (error) {
                setErrorMessagePrevYear('Error fetching data');
            }
        };

        const fetchRequestSecondYear = async () => {
            try {
                const fetchResponse = await fetch(quantityDismiss, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        year: secondYear,
                    }),
                });

                const dataFormatted = await fetchResponse.json();

                if (fetchResponse.status === 403) {
                    setErrorMessageSecondYear(dataFormatted.message);
                } else {
                    setDataSecondYear(dataFormatted.queryResponse);
                }
            } catch (error) {
                setErrorMessageSecondYear('Error fetching data');
            }
        };

        fetchRequest();
        fetchRequestSecondYear();
    }, [prevYear, secondYear, token]);

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

        const labels = dataPrevYear.map((item) => item.month_name);
        const dataPointsPrevYear = dataPrevYear.map((item) => item.total_terminations);
        const dataPointsSecondYear = dataSecondYear.map((item) => item.total_terminations);

        if (chartInstance.current) {
            chartInstance.current.data.labels = labels;
            chartInstance.current.data.datasets[0].data = dataPointsPrevYear;
            chartInstance.current.data.datasets[1].data = dataPointsSecondYear;
            chartInstance.current.data.datasets[0].label = `Cantidad de bajas en ${prevYear}`;
            chartInstance.current.data.datasets[1].label = `Cantidad de bajas en ${secondYear}`;
            chartInstance.current.update();
        } else {
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: `Cantidad de bajas en ${prevYear}`,
                            data: dataPointsPrevYear,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                        },
                        {
                            label: `Cantidad de bajas en ${secondYear}`,
                            data: dataPointsSecondYear,
                            borderColor: 'rgba(192, 75, 192, 1)',
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
    }, [dataPrevYear, prevYear, secondYear, dataSecondYear]);

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Comparación de bajas anuales por año</h2>

            <div className='dashboard__options__container'>
                <div className="dashboard__option__container">
                    <label className='dashboard__option__label' htmlFor="prevYear">Seleccione un año:</label>
                    <select className='dashboard__option__input' onChange={handlePrevYear} name="prevYear" id="prevYear" value={prevYear}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="dashboard__option__container">
                    <label className='dashboard__option__label' htmlFor="secondYear">Segundo año a comparar:</label>
                    <select className='dashboard__option__input' onChange={handleSecondYear} name="secondYear" id="secondYear" value={secondYear}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                {errorMessagePrevYear && <p>{errorMessagePrevYear}</p>}
                {errorMessageSecondYear && <p>{errorMessageSecondYear}</p>}
            </div>

            <div className='quantity_dismiss chart__container'>
                <canvas ref={chartRef} className='chart' />
            </div>
        </div>
    );
};

export default QuantityDismiss;
