
const controller = require('./controller')
//const router = express.Router()
//const router = Router()
const express = require('express')
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require("path")




app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
//app.use(restify.plugins.bodyParser());
//app.use(multer().array())


//use cors to allow cross origin resource sharing
app.use(
    cors({
        origin: 'http://localhost:3000',
        // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
        credentials: true,
    })
);
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
//     res.send()
//     //next(); 
// })
app.post('/create-user', controller.createUser)

app.post('/update-user', function (req, res) {
    let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
    User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS      
    User.find(element => {
        if (element.email === req.body.email) {
            element.coordenadasCurso.push(req.body.coordenadasCurso)
            element.colorDeRelleno.push(req.body.colorRelleno)
            element.coordColorHoras.push(req.body.coordColorHoras)
            element.totalHorasPorMes = [] //se borra el array para que no se acumulen los datos de forma innecesaria
            element.totalHorasPorMes.push(req.body.totalHorasPorMes)
        }
    });
    fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON
    res.send("Usuario actualizado con éxito")
})

app.post('/borrar-toda-programacion', function (req, res) {
    let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
    User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS      
    User.find(element => {
        if (element.email === req.body.email) {
            element.coordenadasCurso = []
            element.colorDeRelleno = []
            element.coordColorHoras = []
            element.totalHorasPorMes = []
        }
    });
    fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON
    res.send("Programación borrada con éxito")
})

app.post('/borrar-curso', function (req, res) {
    let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
    User = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) //JSON a JS   
    User.find(element => {
        if (element.email === req.body.email) {
            for (let i = 0; i < element.coordColorHoras.length; i++) {
                let resultado = false
                resultado = element.coordColorHoras[i].includes(req.body.color.replace(/ /g, "")) //replace(/ /g, "") quita los epacios en blanco intermedios. Por ejemplo rgb(12, 56, 125) y queda rgb(12,56,125). El color llegaba desde el front con espacios en blancos intermedios y por eso no había una coincidencia en la búsquedad. https://es.stackoverflow.com/questions/165669/como-eliminar-los-espacios-en-blanco-en-un-string                
                if (resultado) {
                    let p = 0
                    //Este ciclo actualiza el arreglo donde están las horas totales de cada mes
                    for (let j = 2; j < element.coordColorHoras[i].length; j = j + 3) {
                        element.totalHorasPorMes[0][p] = element.totalHorasPorMes[0][p] - element.coordColorHoras[i][j]
                        p++
                    }
                    element.coordColorHoras.splice(i, 1) //borra las coordenadas del curso que se quiere eliminar
                    element.colorDeRelleno.splice(i, 1) //borra el color del curso que se quiere borrar
                    element.coordenadasCurso.splice(i, 1) // borra la coordenada, el color y la hora parcial del curso que se desea borrar.
                }
            }
        }
    })
    fs.writeFileSync(usersFilePath, JSON.stringify(User, null, "\t")) //de JS a JSON         
    res.send("El curso seleccionado se borró con éxito")
})

app.post("/login",(req,res) =>{
    let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
    let users = fs.readFileSync(usersFilePath, 'utf-8')
    let user = []
    user = JSON.parse(users) //JSON a JS   
    let userFilter = user.filter(element => (element.email === req.body.email && element.password === req.body.password) )    
    if(userFilter.length !== 0){
        res.status(200).send('Usuario encontrado')
    }
    else{
        res.status(400).send('Usuario NO encontrado')
    }
})
app.post("/forgot-password",controller.forgotPassword)
app.get('/reset-password/:id/:token', controller.resetPassword)
app.post('/reset-password/:id/:token', controller.CambioPassword)

app.get("/usuarios-registrados", (req, res) => {
    let usersFilePath = path.join(__dirname, './usuariosRegistrados.json');
    let users = fs.readFileSync(usersFilePath, 'utf-8')
    NewUser = JSON.parse(users) //JSON a JS
    res.json(NewUser) //formato jsob
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server listening on port ", PORT)
})