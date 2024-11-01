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
    isStatusUpdated = false
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

    const [openActionModal, setOpenActionModal] = useState(null);

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

    const openActionsModal = (rowId) => {
        setOpenActionModal(rowId);
    };

    const closeActionsModal = () => {
        setOpenActionModal("closed");
        setOpenActionModal(null);
    };


    const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

    const statusFields = ['status', 'status_sex', 'status_document', 'status_department', 'status_ta', 'status_tot', 'status_sr', 'status_tol'];

    const statusMap = {
        1: 'Activo',
        0: 'Inactivo',
    };

    return (
        <div className='container__page'>
            <div className='container__content'>
                <PreferenceTitle
                    title={title_table}
                    onClick={addButtonTitle}
                />
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
            </div>

            <div className="table__responsive__container">
                <ul className="ul__responsive__table">
                    <li className="responsive__table-header">
                        {columns.map(column => (
                            <div key={column.field} className="responsive__table-col" onClick={() => handleSort(column.field)}>
                                {column.label}
                            </div>
                        ))}
                    </li>
                    {data.length === 0 ? (
                        <li className="responsive__table-body">
                            <p>No hay datos disponibles</p>
                        </li>
                    ) : (
                        data.map(row => (
                            <div className='responsive__table-body__container'>
                                <li key={row[actionColumn]} className="responsive__table-body">
                                    {columns.map(column => {

                                        const cellValue = statusFields.includes(column.field)
                                            ? statusMap[row[column.field]] || 'Desconocido'
                                            : row[column.field];

                                        return (
                                            <>
                                                <div key={column.field} className="responsive__table-col" data-label={column.label}>
                                                    {column.field === 'avatar_user' ? (
                                                        <img
                                                            src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${row[column.field]}`}
                                                            alt="Avatar"
                                                            className="responsive__table-avatar"
                                                        />
                                                    ) :
                                                        cellValue
                                                    }
                                                </div>
                                            </>

                                        )
                                    })}

                                    {openActionModal != row[actionColumn] ? (
                                        <div className='actions__modal-button'>
                                            <ButtonBlue
                                                title={":"}
                                                onClick={() => openActionsModal(row[actionColumn])}
                                            />
                                        </div>
                                    ) : ''}


                                    {openActionModal != 'closed' && openActionModal === row[actionColumn] && (
                                        <div className="actions__modal">
                                            {showActions.view && actions.view && (
                                                <ButtonImgTxt onClick={() => actions.view(row)} title={buttonOneInfo.title} img={buttonOneInfo.img} color={buttonOneInfo.color} />
                                            )}
                                            {showActions.edit && actions.edit && (
                                                <ButtonImgTxt onClick={() => actions.edit(row)} title={buttonTwoInfo.title} img={buttonTwoInfo.img} color={buttonTwoInfo.color} />
                                            )}
                                            {showActions.delete && actions.delete && (
                                                <ButtonImgTxt onClick={() => actions.delete(row)} title={buttonTreeInfo.title} img={buttonTreeInfo.img} color={buttonTreeInfo.color} />
                                            )}
                                            <div className='actions__modal-button__close__container'>
                                                <button className='actions__modal-button__close' onClick={closeActionsModal}>X</button>
                                            </div>
                                        </div>
                                    )}
                                </li>

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
