import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';

// Component
const ListUsers = () => {
    // Estados
    const [users, setUsers] = useState([]);
    const [sortField, setSortField] = useState('username_user');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({ limit: 10, offset: 0, total: 0 });
    const urlGet = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_USER}`

    const { authData } = useAuth();

    // Función para obtener los datos
    const fetchData = async () => {
        const response = await fetch(urlGet, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            },
            body: JSON.stringify({
                limit: pagination.limit,
                offset: pagination.offset,
                orderBy: sortField,
                order: sortOrder,
                filters: filters
            })
        });
        const data = await response.json();
        console.log(data);
        setUsers(data.list);
        setPagination(prev => ({ ...prev, total: data.total }));
    };

    // Efecto para cargar los datos al montar el componente o cambiar filtros/paginación
    useEffect(() => {
        fetchData();
    }, [filters, sortField, sortOrder, pagination.offset, pagination.limit]);

    // Funciones para manejar el orden
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortField(field);
            setSortOrder('ASC');
        }
    };

    // Función para manejar la eliminación de filtros
    const clearFilters = () => {
        setFilters({});
        setSortField('id_user');
        setSortOrder('ASC');
    };

    // Función para manejar la paginación
    const handlePagination = (newOffset) => {
        setPagination(prev => ({ ...prev, offset: newOffset }));
    };

    // Función para agregar filtros
    const addFilter = (filter) => {
        setFilters(prev => ({ ...prev, ...filter }));
    };

    return (
        <div>
            <button onClick={clearFilters}>Eliminar Filtros y Ordenes</button>

            <table>
                <thead>
                    <tr>
                    <th onClick={() => handleSort('name_entity')}>Nombre de usuario</th>
                        <th onClick={() => handleSort('name_entity')}>Nombre</th>
                        <th onClick={() => handleSort('lastname_entity')}>Apellido</th>
                        <th onClick={() => handleSort('value_ed')}>Nro. Documento</th>
                        <th onClick={() => handleSort('value_ec')}>Contacto</th>
                        <th onClick={() => handleSort('file_employee')}>Legajo</th>
                        <th onClick={() => handleSort('name_occupation')}>Ocupación</th>
                        <th onClick={() => handleSort('salary_occupation')}>Salario</th>
                        <th onClick={() => handleSort('name_department')}>Departamento</th>
                        <th onClick={() => handleSort('status_user')}>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users && (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username_user}</td>
                                    <td>{user.name_entity}</td>
                                    <td>{user.lastname_entity}</td>
                                    <td>{user.value_ed}</td>
                                    <td>{user.value_ec}</td>
                                    <td>{user.file_employee}</td>
                                    <td>{user.name_occupation}</td>
                                    <td>{user.salary_occupation}</td>
                                    <td>{user.name_department}</td>
                                    <td>{user.status_user}</td>
                                    <td>
                                        <button>Ver</button>
                                        <button>Editar</button>
                                        <button>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                    )}

                </tbody>
            </table>

            <div>
                <button
                    onClick={() => handlePagination(Math.max(0, pagination.offset - pagination.limit))}
                >
                    &lt;
                </button>
                {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePagination(index * pagination.limit)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePagination(pagination.offset + pagination.limit)}
                >
                    &gt;
                </button>
            </div>

            <div>Total de resultados: {pagination.total}</div>
        </div>
    );
};

export default ListUsers;
