import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Registro from './Registro'
import NotFound from './NotFound'
import Menu from './Menu'
import Rejilla from './Rejilla'
//import Formulario from './formulario/Formulario';
import FormikContainer from './formulario/FormikContainer'
import OlvidoPassword from './OlvidoPassword'
import TokenExpired from './TokenExpired'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/'               element={<Registro />} />
                <Route exact path='/registro'       element={<Registro />} />
                <Route exact path='/olvidoPassword' element={<OlvidoPassword />} />
                <Route exact path='/reset-password/:id/:token' element={<TokenExpired />} />
                <Route exact path='/login'          element={<Login />} />
                <Route exact path='/menu'           element={<Menu/>} />
                <Route exact path='/rejilla'        element={<Rejilla/>} />
                {/* <Route exact path='/formulario' element={<Formulario/>} /> */}
                <Route exact path='/formulario'     element={<FormikContainer/>} />
                <Route path="*"                     element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}
