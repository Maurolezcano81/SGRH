import {
    Link
} from 'react-router-dom';

const HeaderButtons = (props) =>{

    const username = props.username;

    return (
    <div className="navbar__header-redirects">
        <button className='button__navbar' to="/profile/">Mi perfil</button>
        <button className='button__navbar' to="#">Mensajes</button>
    </div>
    )
}

export default HeaderButtons;