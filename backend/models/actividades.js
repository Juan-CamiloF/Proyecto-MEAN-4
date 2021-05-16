//Modulos internos
const mongoose = require("mongoose");
//Esquema
const esquemaActividades = new mongoose.Schema({
  idSprint: String,
  idEquipo: String,
  nombre: String,
  prioridad:String,
  descripcion: String,
  estado: String,
  encargado: String,
});
const Actividad = mongoose.model("actividade", esquemaActividades);
module.exports.Actividad = Actividad;
