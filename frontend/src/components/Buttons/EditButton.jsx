import Edit from '../../assets/Icons/Preferences/Edit.png'


const EditButton = ({ handleClick }) => {
    return (
        <button className="preference__edit" onClick={handleClick}>
            <img src={Edit} alt="Edit" />
        </button>
    )
}

export default EditButton;