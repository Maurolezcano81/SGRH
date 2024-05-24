import React from 'react';

const PreferencesTableHeader = ({ keys }) => {
  return (
    <tr className="preference__head-row">
      {keys.map((key) => (
        <th key={key} className="preference__head-column">
          {key}
        </th>
      ))}
    </tr>
  );
};

export default PreferencesTableHeader;
