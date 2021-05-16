//Modulos internos
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//Crear el esquema de usuario
const esquemaUsuario = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  cedula: String,
  usuario: String,
  contrasenia:String,
  rol: String,
});
//Crear metodos para jwt
esquemaUsuario.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      nombre: this.nombre,
      usuario: this.usuario,
      rol:this.rol
    },
    "scrum"
  );
};
//Exportar el modelo
const Usuario = mongoose.model("usuario",esquemaUsuario);
module.exports.Usuario = Usuario;