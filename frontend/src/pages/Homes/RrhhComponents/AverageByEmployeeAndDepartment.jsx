import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ButtonBlue from "../../../components/ButtonBlue";

const AverageByDepartment = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [listDepartments, setListDepartments] = useState([]);
    const [listQuizzes, setListQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [chartData, setChartData] = useState([]);

    const urlDepartments = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_DEPARTMENT_ACTIVES}`;
    const urlQuizzes = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_QUIZ_PERFORMANCE_ALL}`;
    const urlChartData = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_AVERAGE_PERFORMANCE_FOR_DEPARTMENT_AND_QUIZ}`;

    const fetchDepartments = async () => {
        try {
            const response = await fetch(urlDepartments, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const departments = await response.json();
            setListDepartments(departments.list || []);
        } catch (error) {
            setErrorMessage("Error fetching departments");
        }
    };

    const fetchQuizzes = async () => {
        try {
            const response = await fetch(urlQuizzes, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const quizzes = await response.json();
            setListQuizzes(quizzes.listQuizzes || []);
        } catch (error) {
            setErrorMessage("Error fetching quizzes");
        }
    };

    const fetchChartData = async (id_department, id_ep) => {
        try {
            const response = await fetch(urlChartData, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_department, id_ep }),
            });
            const data = await response.json();

            if (response.status === 403) {
                setErrorMessage(data.message);
            } else {
                setChartData(data.queryResponse || []);
                updateChart(data.queryResponse || []);
                setErrorMessage("")
            }
        } catch (error) {
            setErrorMessage("Error fetching chart data");
        }
    };

    const updateChart = (data) => {
        const ctx = chartRef.current.getContext("2d");

        const dataPoints = data.map((item, index) => ({
            x: index + 1,
            y: item.average_score,
            label: item.name_ep,
            name_ep: item.name_ep,
            average_score: item.average_score,
            name_entity: item.name_entity,
            lastname_entity: item.lastname_entity,
            date_complete: item.date_complete,
        }));

        const backgroundColors = data.map(() => generateRandomColor());

        if (chartInstance.current) {
            chartInstance.current.data.datasets[0].data = dataPoints;
            chartInstance.current.data.datasets[0].backgroundColor = backgroundColors;
            chartInstance.current.update();
        } else {
            chartInstance.current = new Chart(ctx, {
                type: "scatter",
                data: {
                    datasets: [
                        {
                            label: "Puntos de Desempeño",
                            data: dataPoints,
                            backgroundColor: backgroundColors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Evaluaciones",
                            },
                            grid: {
                                display: false,
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Calificación Promedio",
                            },
                            grid: {
                                display: false,
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const dataPoint = context.raw;
                                    return [
                                        `Evaluación: ${dataPoint.name_ep}`,
                                        `Calificación Promedio: ${dataPoint.average_score}`,
                                        `Respondido por: ${dataPoint.name_entity} ${dataPoint.lastname_entity}`,
                                        `Fecha: ${dataPoint.date_complete}`,
                                    ];
                                },
                            },
                        },
                    },
                },
            });
        }
    };

    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    };

    useEffect(() => {
        fetchDepartments();
        fetchQuizzes();
    }, [token]);

    const filteredDepartments = listDepartments.filter((department) =>
        department.name_department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = () => {
        if (selectedDepartment && selectedQuiz) {
            fetchChartData(selectedDepartment, selectedQuiz);
        } else {
            setErrorMessage("Por favor, seleccione un departamento y un cuestionario antes de buscar.");
        }
    };

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Desempeño Promedio por Departamento</h2>

            <div className="dashboard__options__container">
                <div className="dashboard__option__container">
                    <label className="input__form__div__label" htmlFor="">
                        Buscar Departamento:
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar departamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="dashboard__option__select__full"
                    />
                </div>

                <div className="input__form__div w-full gap-2">
                    <select
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        value={selectedDepartment || ""}
                        className="dashboard__option__select__full"
                    >
                        <option value="" disabled>
                            Seleccione un departamento
                        </option>
                        {filteredDepartments.map((department) => (
                            <option key={department.id_department} value={department.id_department}>
                                {department.name_department}
                            </option>
                        ))}
                    </select>

                    <select
                        onChange={(e) => setSelectedQuiz(e.target.value)}
                        value={selectedQuiz || ""}
                        className="dashboard__option__select__full"
                    >
                        <option value="" disabled>
                            Seleccione un cuestionario
                        </option>
                        {listQuizzes.map((quiz) => (
                            <option key={quiz.id_ep} value={quiz.id_ep}>
                                {quiz.name_ep}
                            </option>
                        ))}
                    </select>

                    <ButtonBlue title={"Mostrar"} onClick={handleSearch} />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>

            {chartData.length === 0 && (
                <div className="dashboard__center">No hay datos o información para mostrar</div>
            )}

            <div className="chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>
        </div>
    );
};

export default AverageByDepartment;
