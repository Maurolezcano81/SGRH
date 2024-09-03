import React, { useState, useEffect } from 'react';

const TableHorWithFilters = ({
    url,
    authToken,
    columns,
    filterConfigs,
    searchOptions,
    initialFilters = {},
    initialSort = { field: '', order: 'ASC' },
    initialPagination = { limit: 10, offset: 0 },
    initialSearchTerm = '',
    initialSearchField = '',
    actions = {},
    showActions = {},
    actionColumn = ''  // Nueva prop para especificar la propiedad del row
}) => {
    // Estados
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [sortField, setSortField] = useState(initialSort.field);
    const [sortOrder, setSortOrder] = useState(initialSort.order);
    const [pagination, setPagination] = useState(initialPagination);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [searchField, setSearchField] = useState(initialSearchField || (searchOptions[0]?.value || ''));
    const [searchPlaceholder, setSearchPlaceholder] = useState(initialSearchField || (searchOptions[0]?.label || ''));
    const [filterOptions, setFilterOptions] = useState({});

    // Función para obtener las opciones de los filtros
    const fetchFilterOptions = async () => {
        const fetchPromises = filterConfigs.map(async (filter) => {
            const response = await fetch(filter.url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            return { [filter.key]: data.queryResponse };
        });

        const filterOptionsArray = await Promise.all(fetchPromises);
        setFilterOptions(Object.assign({}, ...filterOptionsArray));
    };

    // Función para obtener los datos
    const fetchData = async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                limit: pagination.limit,
                offset: pagination.offset,
                orderBy: sortField,
                order: sortOrder,
                filters: { ...filters, [searchField]: searchTerm }
            })
        });
        const data = await response.json();
        setData(data.list);
        setPagination(prev => ({ ...prev, total: data.total }));
    };

    // Efectos
    useEffect(() => {
        fetchFilterOptions();
    }, [filterConfigs, authToken]);

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
        setSearchTerm(initialSearchTerm);
        setSearchField(initialSearchField || (searchOptions[0]?.value || ''));
        setSearchPlaceholder(initialSearchField || (searchOptions[0]?.label || ''));
        setSortField(initialSort.field);
        setSortOrder('ASC');
    };

    // Función para manejar la paginación
    const handlePagination = (newOffset) => {
        if (newOffset >= 0 && newOffset < pagination.total) {
            setPagination(prev => ({ ...prev, offset: newOffset }));
        }
    };

    // Función para agregar filtros
    const addFilter = (filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
    };

    // Función para manejar el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para manejar el cambio en el select de búsqueda
    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

    return (
        <div>
            <div>
                <select onChange={handleSearchFieldChange} value={searchField}>
                    {searchOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={`Buscar por ${searchPlaceholder}`}
                />
            </div>
            <button onClick={clearFilters}>Eliminar Filtros y Ordenes</button>

            <div>
                {filterConfigs.map(config => (
                    <label key={config.key}>{config.label}:
                        <select onChange={(e) => addFilter(config.key, e.target.value)} value={filters[config.key] || ''}>
                            <option value="">Seleccionar</option>
                            {(filterOptions[config.key] || []).map(option => (
                                <option key={option.value} value={option.value}> {option[config.name_field]}</option>
                            ))}
                        </select>
                    </label>
                ))}
            </div>

            {data.length === 0 ? (
                <p>No hay datos disponibles</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                {columns.map(column => (
                                    <th key={column.field} onClick={() => handleSort(column.field)}>
                                        {column.label}
                                    </th>
                                ))}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row[actionColumn]}>
                                    {columns.map(column => (
                                        <td key={column.field}>{row[column.field]}</td>
                                    ))}
                                    <td>
                                        {showActions.view && actions.view && (
                                            <button onClick={() => actions.view(row)}>Ver</button>
                                        )}
                                        {showActions.edit && actions.edit && (
                                            <button onClick={() => actions.edit(row)}>Editar</button>
                                        )}
                                        {showActions.delete && actions.delete && (
                                            <button onClick={() => actions.delete(row)}>Eliminar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <button
                            onClick={() => handlePagination(Math.max(0, pagination.offset - pagination.limit))}
                            disabled={pagination.offset === 0}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePagination(index * pagination.limit)}
                                disabled={index + 1 === currentPage}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePagination(pagination.offset + pagination.limit)}
                            disabled={pagination.offset + pagination.limit >= pagination.total}
                        >
                            &gt;
                        </button>
                    </div>

                    <div>Total de resultados: {pagination.total}</div>
                </>
            )}
        </div>
    );
};

export default TableHorWithFilters;
