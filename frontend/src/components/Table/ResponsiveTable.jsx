import React, { useState, useEffect } from 'react';
import PreferenceTitle from '../../pages/MasterTables/PreferenceTitle';
import ButtonRed from '../ButtonRed';
import ButtonImgTxt from '../ButtonImgTex';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';
import ButtonBlue from '../ButtonBlue';

const ResponsiveTable = ({
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
    actionColumn = '',
    paginationLabelInfo,
    buttonOneInfo = { img: "", color: "", title: "" },
    buttonTwoInfo = { img: "", color: "", title: "" },
    buttonTreeInfo = { img: "", color: "", title: "" },
    addButtonTitle,
    isStatusUpdated = false,
    titleInfo,
    headerInfo,
}) => {
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

    const formatDateYear = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const fetchFilterOptions = async () => {
        const fetchPromises = filterConfigs.map(async (filter) => {
            const response = await fetch(filter.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            return { [filter.key]: data.list };
        });

        const filterOptionsArray = await Promise.all(fetchPromises);
        setFilterOptions(Object.assign({}, ...filterOptionsArray));
    };

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
        setTotalResults(data.total || 0)
        setPagination(prev => ({ ...prev, total: data.total }));
    };


    useEffect(() => {
        fetchFilterOptions();
    }, [filterConfigs, authToken]);

    useEffect(() => {
        fetchData();
    }, [filters, sortField, sortOrder, pagination.offset, pagination.limit, searchTerm, searchField, isStatusUpdated]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortField(field);

            setSortOrder('ASC');
        }

    };

    const clearFilters = () => {
        setFilters({});
        setSearchTerm(initialSearchTerm);
        setSearchField(initialSearchField || (searchOptions[0]?.value || ''));
        setSearchPlaceholder(searchOptions[0]?.label || '');
        setSortField(initialSort.field);
        setSortOrder('ASC');
    };

    const handlePagination = (newOffset) => {
        if (newOffset >= 0 && newOffset < pagination.total) {
            setPagination(prev => ({ ...prev, offset: newOffset }));
        }
    };

    const addFilter = (filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
    };


    const toggleFiltersSection = () => {
        setHiddenFilterSection(!hiddenFilterSection)
    }

    const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

    const statusFields = ['status', 'status_sex', 'status_document', 'status_department', 'status_ta', 'status_tot', 'status_sr', 'status_tol', 'status_contact', 'status_sm', 'status_nm', 'status_tse', 'status_occupation', 'status_nacionality', 'status_country', 'status_module'];

    const statusMap = {
        1: 'Activo',
        0: 'Inactivo',
    };

    const toggleExpand = (rowIndex) => {
        setExpandedRows(prevExpandedRows =>
            prevExpandedRows.includes(rowIndex)
                ? prevExpandedRows.filter(index => index !== rowIndex)
                : [...prevExpandedRows, rowIndex]
        );
    };

    const [expandedRows, setExpandedRows] = useState([]);

    return (
        <div className='container__page'>
            <div className='container__content'>
                <PreferenceTitle
                    title={title_table}
                    onClick={addButtonTitle}
                />

                <div className="responsive__table-actions" data-label="Acciones">
                    {showActions.view && actions.view && (
                        <ButtonImgTxt
                            onClick={() => actions.view(row)}
                            title={buttonOneInfo.title}
                            img={buttonOneInfo.img}
                            color={buttonOneInfo.color}
                        />
                    )}
                    {showActions.edit && actions.edit && (
                        <ButtonImgTxt
                            onClick={() => actions.edit(row)}
                            title={buttonTwoInfo.title}
                            img={buttonTwoInfo.img}
                            color={buttonTwoInfo.color}
                        />
                    )}
                    {showActions.delete && actions.delete && (
                        <ButtonImgTxt
                            onClick={() => actions.delete(row)}
                            title={buttonTreeInfo.title}
                            img={buttonTreeInfo.img}
                            color={buttonTreeInfo.color}
                        />
                    )}
                </div>


                <div className='table__filters__container'>
                    <div className='table__search__container'>
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
                            <div className='table__filter__container__button'>
                                <ButtonRed
                                    title={"Limpiar Filtros"}
                                    onClick={clearFilters}
                                />
                            </div>


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


                            </div>
                            <div className='table__filter__orders'>
                                <div className='bold'>
                                    <p>Ordenar por:</p>
                                </div>
                                {searchOptions.map(column => (
                                    <div key={column.value} data-label={sortOrder} className={`${sortField === column.value ? 'sort__selected' : ''} responsive__table-orders`} onClick={() => handleSort(column.value)}>
                                        {column.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="table__responsive__container">
                <ul className="ul__responsive__table">
                    <li className="responsive__table-header">
                        {headerInfo && headerInfo.map((column) => (
                            <div key={column} className="responsive__table-col">
                                {column}
                            </div>
                        ))}
                    </li>

                    {data.length === 0 ? (
                        <li className="responsive__table-body">
                            <p>No hay datos disponibles</p>
                        </li>
                    ) : (
                        data.map((row, rowIndex) => (
                            <div key={rowIndex} className="responsive__table-row">
                                <div className="responsive__table-title">
                                    <div className='responsive__table-title__container'>

                                    {titleInfo.map((fieldInfo, index) => {
                                            const field = typeof fieldInfo === 'string' ? fieldInfo : fieldInfo.field;
                                            const isField = typeof fieldInfo === 'object' && fieldInfo.type === 'field';

                                            return (
                                                isField ? (
                                                    field === 'avatar_user' || field === 'author_profile' ? (
                                                        <div className='responsive__table-avatar__container' key={index}>
                                                            <img
                                                                src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${row[field]}`}
                                                                alt="Avatar"
                                                                className="responsive__table-avatar"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span key={index} className="responsive__table-title__span">
                                                            {row[field] || "N/A"}
                                                        </span>
                                                    )
                                                ) : (
                                                    <span key={index} className="responsive__table-title__span">
                                                        {field}
                                                    </span>
                                                )
                                            );
                                        })}
                                    </div>
                                    <button className={`${expandedRows.includes(rowIndex) ? "non-expanded " : "expanded"} button_expand`} onClick={() => toggleExpand(rowIndex)}>
                                        {expandedRows.includes(rowIndex) ? "Contraer" : "Expandir"}
                                    </button>
                                </div>

                                {expandedRows.includes(rowIndex) && (
                                    <div className="responsive__table-expanded">
                                        {columns.map((column) => {
                                            const cellValue = statusFields.includes(column.field)
                                                ? statusMap[row[column.field]] || 'Desconocido'
                                                : row[column.field];

                                            return (
                                                <div key={column.field} className="responsive__table-col" >
                                                    {column.field === 'avatar_user' ? (
                                                        <div className='responsive__table-avatar__container'>
                                                            <img
                                                                src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${row[column.field]}`}
                                                                alt="Avatar"
                                                                className="responsive__table-avatar"
                                                            />
                                                        </div>
                                                    ) :

                                                        column.field === 'created_at' || column.field === 'updated_at' ?
                                                            <div className="responsive__table-container__expand">
                                                                <span className="responsive__table-label">{column.label}:</span>
                                                                <span className="responsive__table-value">{formatDateYear(cellValue) || "N/A"}</span>
                                                            </div>
                                                            :
                                                            (
                                                                <div className="responsive__table-container__expand">
                                                                    <span className="responsive__table-label">{column.label}:</span>
                                                                    <span className="responsive__table-value">{cellValue || "N/A"}</span>
                                                                </div>
                                                            )}
                                                </div>
                                            );
                                        })}

                                        <div className='responsive__table-col'>
                                            <div className='responsive__table-container__expand'>
                                                <span className="responsive__table-label">Acciones:</span>

                                                <div className="responsive__table-actions" data-label="Acciones">
                                                    {showActions.view && actions.view && (
                                                        <ButtonImgTxt
                                                            onClick={() => actions.view(row)}
                                                            img={buttonOneInfo.img}
                                                            color={buttonOneInfo.color}
                                                        />
                                                    )}
                                                    {showActions.edit && actions.edit && (
                                                        <ButtonImgTxt
                                                            onClick={() => actions.edit(row)}
                                                            img={buttonTwoInfo.img}
                                                            color={buttonTwoInfo.color}
                                                        />
                                                    )}
                                                    {showActions.delete && actions.delete && (
                                                        <ButtonImgTxt
                                                            onClick={() => actions.delete(row)}
                                                            img={buttonTreeInfo.img}
                                                            color={buttonTreeInfo.color}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </ul>
            </div>

            <div className='table__primary__pagination'>
                <div className='table__primary__pagination__info'>
                    <p>{`Cantidad Total de ${paginationLabelInfo}: ${totalResults}`}</p>
                </div>

                <div className='table__primary__pagination__buttons'>
                    <div className='table__primary__pagination__back'>
                        <button
                            onClick={() => handlePagination(Math.max(0, pagination.offset - pagination.limit))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                    </div>

                    <span className='table__primary__pagination__current-page'>
                        {`${currentPage} de ${totalPages}`}
                    </span>

                    <div className='table__primary__pagination__next'>
                        <button
                            onClick={() => handlePagination(pagination.offset + pagination.limit)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ResponsiveTable;
