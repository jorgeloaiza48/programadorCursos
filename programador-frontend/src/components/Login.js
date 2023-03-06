import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './login.css'
import { Link } from "react-router-dom"
//import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import Swal from 'sweetalert2'




export default function Login() {

    const cookies = new Cookies()
    const navigate = useNavigate();
    const baseURL = "http://localhost:3001/login"
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [userName, setUsername] = useState("")
    const [showPassword, setShowPassword] = useState(true)


    const handleChange = (e) => {
        const { name, value } = e.target
        setUsername({ ...userName, [name]: value })
    }

    const handleClickPassword = (e) => {
        setErrorPassword("")
    }
    const handleClickEmail = (e) => {
        setErrorEmail("")
    }
    const handleShowPassword = () =>{
        setShowPassword(!showPassword)
    }


    //Este bloque de código realiza una petición al servidor donde está el JSON de los usuarios registrados.
    //Si el email y contraseña ingresados coinciden con los del JSON entonces hay inicio de sesión
    const iniciarSesion = (e) => {
        e.preventDefault()
        if ((userName.password === undefined || userName.password.length === 0) && (userName.email === undefined || userName.email.length === 0)) {
            setErrorPassword("Debe ingresar una contraseña.")
            setErrorEmail("Debe ingresar un correo electrónico.")
            return
        }
        if (userName.password === undefined || userName.password.length === 0) {
            setErrorPassword("Debe ingresar una contraseña.")
            return
        }
        if (userName.email === undefined || userName.email.length === 0) {
            setErrorEmail("Debe ingresar un correo electrónico.")
            return
        }
        // fetch(baseURL, {
        //     method: 'GET',
        //     headers: { "Content-Type": "Application/json", "Accept": "application/json" }
        // })
        //     .then(response => response.json())
        //     .then(function (response) {
        //         let result = response.filter(element => element.email === userName.email && element.password === userName.password)
        //         if (result.length > 0) {
        //             cookies.set('email', userName.email, { path: '/' })
        //             window.location.href = "./rejilla"
        //         }
        //         else {
        //             alert("El correo y/o la contraseña ingresada no son correctas.")
        //             navigate('/login')
        //         }
        //     })
        //     .catch(() => alert("No se puede iniciar sesión por un problema en el servidor"),
        //         navigate('/login')
        //     )

        fetch(baseURL, {
            method: 'POST',
            headers: { "Content-Type": "Application/json" },
            body: JSON.stringify(userName)
        })
            .then(response => {
                if (response.status === 200) {
                    cookies.set('email', userName.email, { path: '/' })
                    window.location.href = "./rejilla"
                }
                else {
                    Swal.fire({
                        title: "Las credenciales ingresadas no son correctas.",
                        icon: "error"
                    })
                    navigate('/login')
                }
            })
    }

    //Si ya se inició sesión y se escribe en la barra de direcciones '/login' entonces lo redirige al menú.
    useEffect(() => {
        if (cookies.get('email')) {
            window.location.href = "./rejilla"
        }
    })


    return (
        <div className='formLogin'>
            <form >
                <LoginIcon className='loginIcon' sx={{ fontSize: 45 }}></LoginIcon>
                <h4 className='inicioSesion'>Inicio de sesión</h4>
                <div className='containerPrincipal border rounded'>
                    <div classname='containerSecundario'>
                        <div className='form-group d-grid gap-2'>
                            <label>Usuario o email:</label>
                            <input type="email" className='form-control' name='email' onChange={handleChange} onClick={handleClickEmail} autoComplete="on" placeholder='Ingrese usuario'/> <br />
                            <p className='errorEmailLogin'>{errorEmail}</p>
                            <label>Contraseña:</label>
                            <input type={showPassword ? "password": "text"} className='form-control' name='password' onChange={handleChange} onClick={handleClickPassword} autoComplete="on" placeholder='Ingrese contraseña' /> <br />
                            <p className='errorPasswordLogin'>{errorPassword}</p>
                            <button type="submit" className='btn btn-primary' onClick={iniciarSesion}>Iniciar Sesión</button>
                            <div className='regPass'>
                                <Link to="/registro">Registrarse</Link>
                                <Link to="/olvidoPassword">¿Olvidó la contraseña?</Link>
                            </div>
                            <MailOutlineIcon className='MailOutlineIconLogin'></MailOutlineIcon>
                            <PasswordIcon className='PasswordIconLogin'onClick={handleShowPassword}></PasswordIcon>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
