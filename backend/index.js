//Modulos internos
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//Modulos creados
const usuario = require("./routes/usuarios");
const auth = require("./routes/auth");
const proyecto = require('./routes/proyectos')
const equipo = require('./routes/equipos');
const sprint = require('./routes/sprints');
const actividades = require('./routes/actividades');
//Crear la aplicion
const app = express();
//Manejo de la aplicacion
app.use(cors());
app.use(express.json());
app.use("/scrum/usuario", auth);
app.use("/scrum/usuario", usuario);
app.use("/scrum/proyecto",proyecto);
app.use("/scrum/sprint", sprint)
app.use("/scrum/equipo", equipo);
app.use("/scrum/actividad", actividades)
//Puerto para la aplicación
const port = process.env.PORT | 3000;
//Alistar aplicacion
app.listen(port, () => {
  console.log("Ejecución en el puerto: ", port);
});
//Conexion y configuracion bases de datos
mongoose
  .connect("mongodb://127.0.0.1:27017/proyecto4", {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Base de datos funcionando");
  }).catch((err)=>{
      console.log("Hubo un problema con la base de datos: ",err);
  })
