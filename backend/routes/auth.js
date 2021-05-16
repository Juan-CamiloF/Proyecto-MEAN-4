//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Usuario } = require("../models/usuario");
const auth = require("../middleware/auth");
//Rutas
//Iniciar sesión
router.post("/iniciar", async (request, response) => {
  //Buscar si existe el usuario
  const usuario = await Usuario.findOne({ usuario: request.body.usuario });
  //Si no existe
  if (!usuario)
    return response.status(400).send("Usuario o contraseña incorrectos");
  //Si existe
  if (usuario.contrasenia !== request.body.contrasenia) {
    return response.status(400).send("Usuario o contraseña incorrectos");
  }
  //Generar token
  const token = usuario.generateJWT();
  //Enviar respuesta
  response.status(200).send({ token });
});
//Información de usuario
router.get("/informacion", auth, async (request, response) => {
  //Buscar si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const rol = usuario.rol
  response.status(200).send({rol});
});
module.exports = router;
