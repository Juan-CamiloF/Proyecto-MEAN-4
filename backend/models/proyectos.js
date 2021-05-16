//Modulos internos
const mongoose = require('mongoose');
//Esquema
const esquemaProyecto = new mongoose.Schema({
    idUsuario:String,
    creador:String,
    nombre:String,
    fechaDeInicio:Date,
    fechaDeFin:Date,
    estado:String,
    fechaCreacion:{
        type:Date,
        default:Date.now
    },
})
const Proyecto = mongoose.model("proyecto",esquemaProyecto)
//Exportar
module.exports.Proyecto = Proyecto;