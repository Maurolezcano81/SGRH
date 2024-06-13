import Trash from '../../assets/Icons/Preferences/Trash.png';

const DeleteButton = ({ action }) => {
  return (
    <button className="preference__delete" onClick={action}>
      <img src={Trash} alt="Delete" />
    </button>
  );
};

export default DeleteButton;
