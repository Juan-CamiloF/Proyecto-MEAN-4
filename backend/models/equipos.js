//Modulos internos
const mongoose = require('mongoose');
//Esquema
const esquemaEquipo = mongoose.Schema({
    idProyecto:String,
    nombres: String,
    apellidos: String,
    cedula: String,
    usuario: String,
    contrasenia:String,
    rol: String,
});
const Equipo = mongoose.model("equipo",esquemaEquipo);
module.exports.Equipo = Equipo;
