import React from 'react';
import Edit from '../../../assets/Icons/Preferences/Edit.png';
import Trash from '../../../assets/Icons/Preferences/Trash.png';
import ToggleButton from '../../ToggleButton';
import useAuth from '../../../hooks/useAuth';

const PreferencesBodyRow = ({
  items,
  keys,
  fetchUrl,
  handleEdit,
  handleModalDelete,
  handleStatusToggle,
  status_name,
  handleDependencyToggle,
  handleDelete
}) => {
  const handleDeleteClick = (item) => {
    handleDelete(item);
    handleModalDelete();
  };
  return (
    <>
      {items.map((item, index) => (
        <tr key={index} className="preference__body-row">
          {keys.map((key) => (
            <td key={key} className="preference__body-column">
              {item[key]}
            </td>
          ))}
          <td>
            <ToggleButton
              className="preference__state"
              onClick={() => handleStatusToggle(item)}
              status_value={item[status_name[1]] === 1}
              fetchUrl={fetchUrl}
              status_name={status_name}
              idToToggle={item[status_name[0]]}  // Asegúrate de pasar el ID correcto aquí
              item={item}
              handleDependencyToggle={handleDependencyToggle}
            />
          </td>
          <td className="preference__body-column">
            <div className="buttons__table-preference">
              <button className="preference__edit" onClick={() => handleEdit(item)}>
                <img src={Edit} alt="Edit" />
              </button>
              <button className="preference__delete" onClick={() => handleDeleteClick(item)}>
                <img src={Trash} alt="Delete" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PreferencesBodyRow;
