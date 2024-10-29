import React, { useState, useEffect } from 'react';
import PreferenceTitle from '../../pages/MasterTables/PreferenceTitle';
import ButtonRed from '../ButtonRed';
import ButtonImgTxt from '../ButtonImgTex';
import ButtonWhiteOutlineBlack from '../Buttons/ButtonWhiteOutlineBlack';

const TableSecondaryNotTitleAndWhereOnUrl = ({
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
    actionColumn = '',
    paginationLabelInfo,
    buttonOneInfo = { img: "", color: "", title: "" },
    buttonTwoInfo = { img: "", color: "", title: "" },
    buttonTreeInfo = { img: "", color: "", title: "" },
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
        setTotalResults(data.total);
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

    return (
        <div className="table__responsive__container">
            <h2>Tabla</h2>
            <ul className="ul__responsive__table">
                <li className="responsive__table-header">
                    {columns.map(column => (
                        <div key={column.field} className="responsible__table-col" onClick={() => handleSort(column.field)}>
                            {column.label}
                        </div>
                    ))}
                    <div className="responsible__table-col">Acciones</div>
                </li>
                {data.length === 0 ? (
                    <li className="responsive__table-body">
                        <p>No hay datos disponibles</p>
                    </li>
                ) : (
                    data.map(row => (
                        <li className="responsive__table-body" key={row[actionColumn]}>
                            {columns.map(column => (
                                <div key={column.field} className="responsible__table-col" data-label={column.label}>
                                    {column.field === 'avatar_user' ? (
                                        <img
                                            src={`${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/${row[column.field]}`}
                                            alt="Avatar"
                                            className="responsible__table-avatar"
                                        />
                                    ) : (
                                        row[column.field]
                                    )}
                                </div>
                            ))}
                            <div className="responsible__table-col__actions" data-label="Acciones">
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
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TableSecondaryNotTitleAndWhereOnUrl;
