//Modulos internos
const mongoose = require("mongoose");
//Esquema
const esquemaSprint = new mongoose.Schema({
  idProyecto: String,
  sprint: Number,
  nombre: String,
  duracion: String,
  estado:String,
});
const Sprint = mongoose.model("sprint", esquemaSprint);
module.exports.Sprint = Sprint;
