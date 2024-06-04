import { useState } from 'react';

import PersonalDropDown from './PersonalDropDown';
import Analytics from './Analytics';

const AdminOptions = () => {
  const [isAnalyticsDropdownOpen, setIsAnalyticsDropdownOpen] = useState(false);
  const [isPersonalDropdownOpen, setIsPersonalDropdownOpen] = useState(false);

  const closeDropdowns = () => {
    setIsAnalyticsDropdownOpen(false);
    setIsPersonalDropdownOpen(false);
  };

  return (
    <>
      <Analytics
        isDropdown={isAnalyticsDropdownOpen}
        setIsDropdown={setIsAnalyticsDropdownOpen}
        closeDropdowns={closeDropdowns}
      />
      <PersonalDropDown
        isDropdown={isPersonalDropdownOpen}
        setIsDropdown={setIsPersonalDropdownOpen}
        closeDropdowns={closeDropdowns}
      />

    </>
  );
};

export default AdminOptions;
