import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ButtonBlue from "../../../components/ButtonBlue";

const AverageByEmployee = ({ token }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [listUsers, setListUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [chartData, setChartData] = useState([]);
    const url = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_AVERAGE_PERFORMANCE_FOR_EMPLOYEE}`;
    const urlUsers = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_USER_INFORMATION}`;
    const urlQuizzes = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_USER_INFORMATION}`;

    const fetchUsers = async () => {
        try {
            const response = await fetch(urlUsers, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const users = await response.json();
            setListUsers(users.listUsers || []);
        } catch (error) {
            setErrorMessage("Error fetching users");
        }
    };

    const fetchChartData = async (id_user) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_user }),
            });
            const data = await response.json();

            console.log(data)
            if (response.status === 403) {
                setErrorMessage(data.message);
            } else {
                setChartData(data.queryResponse || []);
                updateChart(data.queryResponse || [])
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
            answered_name: item.answered_name,
            answered_lastname: item.answered_lastname,
            date_complete: item.date_complete
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
                                    const totalAverage = dataPoint.average_score
                                    const evaluationLabel = dataPoint.name_ep;
                                    const answered_name = dataPoint.answered_name;
                                    const answered_lastname = dataPoint.answered_lastname;
                                    const date_complete = dataPoint.date_complete;

                                    return [
                                        `Evaluación: ${evaluationLabel}`,
                                        `Calificación Promedio: ${totalAverage}`,
                                        `Respondido por ${answered_name} ${answered_lastname}`,
                                        `Fecha ${date_complete}`
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
        fetchUsers();
    }, [token]);

    const filteredUsers = listUsers.filter((user) =>
        `${user.name_entity} ${user.lastname_entity}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleSearch = () => {
        if (selectedUser) {
            fetchChartData(selectedUser);
        } else {
            setErrorMessage("Por favor, seleccione un empleado antes de buscar.");
        }
    };

    return (
        <div className="container__content container__stadistic__individual">
            <h2 className="bold">Desempeño Promedio por Usuario</h2>

            <div className="dashboard__options__container">
                <div className="dashboard__option__container">
                    <label className="input__form__div__label" htmlFor="">
                        Buscar Empleado:
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar empleado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="dashboard__option__select__full"
                    />
                </div>


                <div className="input__form__div  w-full gap-2">
                    <select
                        onChange={(e) => setSelectedUser(e.target.value)}
                        value={selectedUser || ""}
                        className="dashboard__option__select__full"
                    >
                        <option value="" disabled>
                            Seleccione un empleado
                        </option>
                        {filteredUsers.map((user) => (
                            <option key={user.id_user} value={user.id_user}>
                                {user.name_entity} {user.lastname_entity}
                            </option>
                        ))}
                    </select>
                    <ButtonBlue
                        title={"Mostrar"}
                        onClick={handleSearch}
                    />

                </div>

                {searchTerm === "" && errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>


            {searchTerm != "" && chartData.length < 1 && (
                <div className="dashboard__center">
                    No hay datos o información para mostrar
                </div>
            )}

            {searchTerm === "" && chartData.length < 1 && (
                <div className="dashboard__center">
                    Primero debe seleccionar un empleado
                </div>
            )}

            <div className="chart__container">
                <canvas ref={chartRef} className="chart" />
            </div>
        </div>
    );
};

export default AverageByEmployee;
