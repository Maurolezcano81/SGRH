import useAuth from '../hooks/useAuth';

const ToggleButton = ({ fetchUrl, status_value, status_name, idToToggle }) => {
  const { authData } = useAuth();

  const handleSubmit = async (item) => {
    console.log(idToToggle);

    const updatedStatus = item[status_name[1]] === 1 ? 0 : 1;
    const body = {
      [status_name[0]]: idToToggle,
      [status_name[1]]: updatedStatus,
    };

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
    } catch (error) {
      console.log('Error al actualizar el estado', error);
    }
  };

  return (
    <div className="toggle-container" onClick={handleSubmit}>
      <div className={`toggle-circle ${status_value ? 'active' : ''}`}></div>
    </div>
  );
};

export default ToggleButton;
