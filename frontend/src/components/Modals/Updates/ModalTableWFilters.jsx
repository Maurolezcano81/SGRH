import React, { useState, useEffect } from 'react';
import PreferenceTitle from '../../../pages/MasterTables/PreferenceTitle';
import ButtonRed from '../../ButtonRed';
import ButtonImgTxt from '../../ButtonImgTex';
import ButtonWhiteOutlineBlack from '../../Buttons/ButtonWhiteOutlineBlack';
import ButtonWhiteWithShadow from '../../Buttons/ButtonWhiteWithShadow';

const ModalTableWFilters = ({
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
    title_table,
    actionColumn = '',  // Nueva prop para especificar la propiedad del row
    paginationLabelInfo,
    buttonOneInfo = { img: "", color: "", title: "" },
    buttonTwoInfo = { img: "", color: "", title: "" },
    buttonTreeInfo = { img: "", color: "", title: "" },
    addButtonTitle,
    isStatusUpdated = false,
    handleCloseModal,
    colorTable = ""
}) => {
    // Estados
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [sortField, setSortField] = useState(initialSort.field);
    const [sortOrder, setSortOrder] = useState(initialSort.order);
    const [pagination, setPagination] = useState(initialPagination);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [searchField, setSearchField] = useState(initialSearchField || (searchOptions[0]?.value || ''));
    const [searchPlaceholder, setSearchPlaceholder] = useState(searchOptions[0]?.label || '');
    const [filterOptions, setFilterOptions] = useState({});
    const [hiddenFilterSection, setHiddenFilterSection] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

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
        setTotalResults(data.total)
        setPagination(prev => ({ ...prev, total: data.total }));
    };

    // Efectos
    useEffect(() => {
        fetchFilterOptions();
    }, [filterConfigs, authToken]);

    useEffect(() => {
        fetchData();
    }, [filters, sortField, sortOrder, pagination.offset, pagination.limit, searchTerm, searchField, isStatusUpdated]);

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
        setSearchPlaceholder(searchOptions[0]?.label || '');
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

    const toggleFiltersSection = () => {
        setHiddenFilterSection(!hiddenFilterSection)
    }

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

    return (
        <div className="alert__background__black" onClick={handleCloseModal}>
                <div className="modal__table__container" onClick={(e) => e.stopPropagation()}>
                    <PreferenceTitle
                        title={title_table}
                        addButtonTitle={addButtonTitle}
                        color='bg__green-5'
                    />
                    <div className='table__filters__container'>
                        <div className={`table__search__container ${colorTable}`}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder={`Buscar por ${searchPlaceholder}`}
                            />
                            <div className='table__search__select__container'>
                                <label>Buscar por:</label>
                                <select onChange={handleSearchFieldChange} value={searchField}>
                                    {searchOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='table__search__buttons__container'>
                                {hiddenFilterSection ? (
                                    <ButtonWhiteOutlineBlack title={"Ocultar filtros avanzados"} onClick={toggleFiltersSection} />
                                ) : (
                                    <ButtonWhiteOutlineBlack title={"Mostrar filtros avanzados"} onClick={toggleFiltersSection} />
                                )}
                            </div>
                        </div>

                        {hiddenFilterSection && (
                            <div className='table__filter__container'>
                                <div className='table__filter__select'>
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

                                    <div className='table__filter__container__button'>
                                        <ButtonRed
                                            title={"Limpiar Filtros"}
                                            onClick={clearFilters}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>


                    {data.length === 0 ? (
                        <p>No hay datos disponibles</p>
                    ) : (
                        <div className='table__primary__container'>
                            <table className='table__primary'>
                                <thead>
                                    <tr>
                                        {columns.map(column => (
                                            <th className={`${colorTable}`} key={column.field} onClick={() => handleSort(column.field)}>
                                                {column.label}
                                            </th>
                                        ))}
                                        <th className={`${colorTable}`}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(row => (
                                        <tr key={row[actionColumn]}>
                                            {columns.map(column => (
                                                <td className='table__primary__body__col' key={column.field}>
                                                    {column.field === 'avatar_user' ? (
                                                        <img className='table__primary__img' src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${row[column.field]}`} alt="Avatar" />
                                                    ) : (
                                                        row[column.field]
                                                    )}
                                                </td>
                                            ))}
                                            <td>
                                                <div className='table__primary__actions__container'>
                                                    {showActions.view && actions.view && (
                                                        <ButtonImgTxt onClick={() => actions.view(row)} title={buttonOneInfo.title} img={buttonOneInfo.img} color={buttonOneInfo.color} />
                                                    )}
                                                    {showActions.edit && actions.edit && (
                                                        <ButtonImgTxt onClick={() => actions.edit(row)} title={buttonTwoInfo.title} img={buttonTwoInfo.img} color={buttonTwoInfo.color} />
                                                    )}
                                                    {showActions.delete && actions.delete && (
                                                        <ButtonImgTxt onClick={() => actions.delete(row)} title={buttonTreeInfo.title} img={buttonTreeInfo.img} color={buttonTreeInfo.color} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                        </div>
                    )}

                    <div className='table__primary__pagination'>
                        <div className={` table__primary__pagination__info ${colorTable}`}>
                            <p>{`Cantidad total de ${paginationLabelInfo}: ${totalResults}`}</p>
                        </div>

                        <div className={`table__primary__pagination__buttons`}>
                            <div className='table__primary__pagination__back'>
                                <button
                                    className={`${colorTable}`}
                                    onClick={() => handlePagination(Math.max(0, pagination.offset - pagination.limit))}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>
                            </div>

                            <span className='table__primary__pagination__current-page'>
                                {currentPage}
                            </span>

                            <div className='table__primary__pagination__next'>
                                <button
                                    className={`${colorTable}`}
                                    onClick={() => handlePagination(pagination.offset + pagination.limit)}
                                    disabled={currentPage === totalPages} // Deshabilitar si está en la última página
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className='modal__table__exit__container'>
                        <ButtonWhiteOutlineBlack 
                            title={`Volver al departamento`}
                            onClick={handleCloseModal}
                        />
                    </div>
                </div>

            </div>
    );
};

export default ModalTableWFilters;
