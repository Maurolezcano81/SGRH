import React from 'react';

const PreferencesTableHeader = ({ keys }) => {
  return (
    <>
      {keys.map((key) => (
        <th key={key} className="preference__head-column">
          {key}
        </th>
      ))}
    </>
  );
};

export default PreferencesTableHeader;
