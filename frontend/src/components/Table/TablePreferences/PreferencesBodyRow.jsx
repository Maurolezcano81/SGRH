import React from 'react';

import Edit from '../../../assets/Icons/Preferences/Edit.png';
import Trash from '../../../assets/Icons/Preferences/Trash.png';

const PreferencesBodyRow = ({ items, keys, handleEdit, handleDelete }) => {
  return (
    <>
      {items.map((item, index) => (
        <tr key={index} className="preference__body-row">
          {keys.map((key) => (
            <td key={key} className="preference__body-column">
              {item[key]}
            </td>
          ))}
          <td className="preference__body-column">
            <div className="buttons__table-preference">
              <button className="preference__edit" onClick={() => handleEdit(item)}>
                <img src={Edit} />
              </button>
              <button className="preference__delete" onClick={() => handleDelete(item)}>
                <img src={Trash} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PreferencesBodyRow;
