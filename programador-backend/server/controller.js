//const express = require('express')
//const cors = require('cors');
// const app = express()
// const bodyParser = require('body-parser');
const fs = require('fs')
const path = require("path");
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const JWT_SECRTET = "some super secret..."
let idGlobal = 0 //I had to set this global variable because when I am setting "app.get('/reset-password/:id/:token', controller.resetPassword)", I can´t render the view for changing password. And I also had problems with req.params. I couldn´t get them. why? I do not know.
let token = ""

const controller = {

    forgotPassword: (req, res) => {
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        let users = fs.readFileSync(usersFilePath, 'utf-8')
        let user = []
        user = JSON.parse(users) //JSON a JS   

        //Make sure email exists in dataBase
        let userFilter = user.filter(element => element.email === req.body.email)
        if (userFilter.length !== 0) {
            idGlobal = userFilter[0].id
            const payload = {
                //email: userFilter[0].email,
                id: userFilter[0].id
            }
            token = jwt.sign(payload, JWT_SECRTET, { expiresIn: '5m' })
            const link = `http://localhost:3000/reset-password/${userFilter[0].id}/${token}`

            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                host: 'smtp.gmail.com',
                port: 2525,  //25 o 587 o 465 o 2525
                secure: true,
                auth: {
                    user: "jelm48@misena.edu.co",
                    pass: "George4810008968@#3"
                }
            })
            //Features of email to be sent
            const info = {
                from: 'jelm48@misena.edu.co',
                to: userFilter[0].email,
                subject: "Recuperación de contraseña programador cursos",
                text: "Correo de prueba para recuperar contraseña",
                html: '<p>Recientemente solicitaste un reestablecimiento de contraseña para el programador de cursos.</p>' +
                    `<p>Click <a href=${link}>aquí</a> para reestablecer contraseña.</p>` +
                    '<p>Este enlace expirará en 5 minutos.</p>'
            }
            //sending email
            transporter.sendMail(info, function (error, info) {
                if (error) {
                    return console.log(error)
                }
                //console.log("Message sent: " + info.response)
                res.status(200).send('Correo enviado para reestablecer contraseña')
            })
        }
        else {
            res.status(400).send('Usuario NO encontrado')
        }

    },

    resetPassword: (req, res, next) => {
        // const { id, token } = req.params                      
        jwt.verify(token, JWT_SECRTET, (err) => {
            if (err) {
                return res.status(400).send('Enlace ya no es válido')
            }
            else {
                return res.status(200).send('Enlace aún es válido')
            }
        })
    },

    CambioPassword: (req, res) => {
        //const { id, token } = req.params //         
        let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
        User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS                  
        User.find(element => {
            if (element.id === idGlobal) {
                element.password = ""
                element.password = req.body.password
                fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON
                res.status(200).send('Password has been changed successfully')
            }
        })



    }
}
module.exports = controller
