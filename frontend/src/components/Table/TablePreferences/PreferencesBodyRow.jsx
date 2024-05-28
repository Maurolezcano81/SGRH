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
  handleDelete,
  status_name,
  onStatusToggle,
  selectedOccupationId,
}) => {
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
              status_value={item[status_name[1]] === 1}
              fetchUrl={fetchUrl}
              onStatusToggle={() => onStatusToggle(item)}
              status_name={status_name}
              selectedOccupationId={selectedOccupationId}
            />
          </td>
          <td className="preference__body-column">
            <div className="buttons__table-preference">
              <button className="preference__edit" onClick={() => handleEdit(item)}>
                <img src={Edit} alt="Edit" />
              </button>
              <button className="preference__delete" onClick={() => handleDelete(item)}>
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
