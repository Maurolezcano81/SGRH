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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('username_user'); // Estado para el campo de búsqueda
    const [filterOptions, setFilterOptions] = useState({
        occupations: ['Asociado de Ventas', 'Contador', 'Analyst'], // Ejemplos de opciones
        departments: ['Marketing', 'Recursos Humanos', 'IT'] // Ejemplos de opciones
    });
    const urlGet = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}${process.env.RALL_USER}`;

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
                filters: { ...filters, [searchField]: searchTerm } // Agregar búsqueda a los filtros
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
    }, [filters, sortField, sortOrder, pagination.offset, pagination.limit, searchTerm, searchField]);

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
        setSearchTerm('');
        setSearchField('username_user'); // Restablecer campo de búsqueda
        setSortField('username_user');
        setSortOrder('ASC');
    };

    // Función para manejar la paginación
    const handlePagination = (newOffset) => {
        setPagination(prev => ({ ...prev, offset: newOffset }));
    };

    // Función para agregar filtros
    const addFilter = (filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
    };

    // Función para manejar el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para manejar la selección de filtros
    const handleFilterChange = (filterKey, e) => {
        addFilter(filterKey, e.target.value);
    };

    // Función para manejar el cambio en el select de búsqueda
    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
    };

    return (
        <div>
            <div>
                <select onChange={handleSearchFieldChange} value={searchField}>
                    <option value="username_user">Nombre de usuario</option>
                    <option value="name_entity">Nombre</option>
                    <option value="lastname_entity">Apellido</option>
                    <option value="value_ed">Nro. Documento</option>
                    <option value="value_ec">Contacto</option>
                    <option value="file_employee">Legajo</option>
                    <option value="name_occupation">Ocupación</option>
                    <option value="salary_occupation">Salario</option>
                    <option value="name_department">Departamento</option>
                    <option value="status_user">Estado</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={`Buscar por ${searchField.replace('_', ' ')}`}
                />
            </div>
            <button onClick={clearFilters}>Eliminar Filtros y Ordenes</button>

            <div>
                <label>Ocupación:
                    <select onChange={(e) => handleFilterChange('name_occupation', e)}>
                        <option value="">Seleccionar</option>
                        {filterOptions.occupations.map(occupation => (
                            <option key={occupation} value={occupation}>{occupation}</option>
                        ))}
                    </select>
                </label>
                <label>Departamento:
                    <select onChange={(e) => handleFilterChange('name_department', e)}>
                        <option value="">Seleccionar</option>
                        {filterOptions.departments.map(department => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </select>
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('username_user')}>Nombre de usuario</th>
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
