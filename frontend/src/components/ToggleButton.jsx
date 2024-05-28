import { useState } from "react";
import useAuth from "../hooks/useAuth";

const ToggleButton = ({ fetchUrl,status_value, onStatusToggle, status_name, selectedOccupationId }) => {
  const [isActive, setIsActive] = useState(false);


  const { authData } = useAuth();

  const handleClick = async (item) => {
    console.log(selectedOccupationId)
    console.log()
    const updatedStatus = item[status_name[1]] === 1 ? 0 : 1;
    const body = {
      [status_name[0]]:item.id_occupation,
      [status_name[1]]: updatedStatus,
    };
    console.log(body);

    try {
      const fetchResponse = await fetch(fetchUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await fetchResponse.json();
      if (!fetchResponse.ok) {
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      onStatusToggle();

    } catch (error) {
      console.log('Error al actualizar el estado', error);
    }
  };

  return (
    <div className="toggle-container" onClick={handleClick}>
      <div className={`toggle-circle ${status_value ? "active" : ""}`}></div>
    </div>
  );
};

export default ToggleButton;
