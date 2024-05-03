import User from '../assets/Icons/Login/User.png';
import Invisible from '../assets/Icons/Login/Invisible.png';
import Enterprise from '../assets/Enterprise.png'
import {
    useState
} from 'react';
import {
    Link,
    useNavigate
} from 'react-router-dom';

import useAuth from '../hooks/useAuth';
const Login = () => {

    const urlApi = `${process.env.SV_HOST}${process.env.SV_PORT}${process.env.SV_ADDRESS}/signIn`;

    const [error, setError] = useState('');

    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [isCheck, setIsCheck] = useState(null);

    const Navigate = useNavigate();
    const { storageAuthData } = useAuth();

    const changeUsername = (e) => {
        setUsername(e.target.value);
    }

    const changePwd = (e) => {
        setPwd(e.target.value);
    }

    const changeKeepSesion = (e) => {
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
                const response = await fetch(urlApi, {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        pwd: pwd
                    })
                })

            const fetchData = await response.json();
            
            const error = document.getElementById('errorMessage');
            if (response.status != 200) {
                error.classList.replace('success', 'error');
                error.style.display = 'block';
                setError(fetchData.message);
                return;
            }

            error.classList.replace('error','success');
            error.style.display = 'block';
            setError(fetchData.message);
            storageAuthData(fetchData.userData);

            setTimeout( () =>{
                switch(fetchData.userData.name_profile){
                    case "Administrador":
                        Navigate('/admin/inicio')
                    break;
                    case "Personal":
                        Navigate('/personal/inicio')
                    break;
                }
                Navigate('/admin/inicio')    
            }, 1000)

        } catch (e) {
            console.error(e.name);
        }
    }
    

    return (
        <div className="login__container">
            <div className="login__content">
                <div className="login-title">
                    <h2>INICIAR SESIÓN</h2>
                </div>
                <div className="login__form__container">
                    <div className="login__form__content">
                        <div className="login__form-img">
                            <img src={Enterprise} alt="" />
                        </div>
                        <form action='/' onSubmit={handleSubmit} className="login__form">
                            <div className="login__input-container">
                                <label>Nombre de usuario o email</label>
                                <div className="login-input">
                                    <input
                                        type="text"
                                        onChange={changeUsername} />
                                    <img src={User} alt="Icono de Usuario" />
                                </div>
                            </div>
                            <div className="login__input-container">
                                <label>Clave</label>
                                <div className="login-input">
                                    <input
                                        type="password"
                                        onChange={changePwd} />
                                    <img src={Invisible} alt="Icono de Usuario" />
                                </div>
                            </div>

                            <div className="login__input-checkbox">
                                <input
                                    type="checkbox"
                                    onChange={changeKeepSesion}
                                />
                                <p>Mantener sesión iniciada</p>
                            </div>

                            <div id='errorMessage' className="login__error error">
                                <p>{error}</p>
                            </div>

                            <div className="login__button">
                                <button onTouchEnd={handleSubmit} type='submit'>INICIAR</button>
                            </div>

                            <div className='login__forgot'>
                                <Link href="#">¿Olvidates tu contraseña? Haz clic aquí.</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;