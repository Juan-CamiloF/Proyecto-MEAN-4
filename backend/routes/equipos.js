//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Usuario } = require("../models/usuario");
const { Equipo } = require("../models/equipos");
const { Proyecto } = require("../models/proyectos");
const auth = require("../middleware/auth");
//Agregar equipo al proyecto
router.post("/agregar", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Scrum Master" || usuario.rol == "Lider Técnico") {
    const usuario = await Usuario.findOne({ usuario: request.body.usuario });
    if (!usuario) return response.status(400).send("El usuario no existe");
    const proyecto = await Proyecto.findById(request.body.idProyecto);
    if (!proyecto) return response.status(400).send("El proyecto no existe");
    const usuarioEnProyecto = await Equipo.findOne({
      $and: [{ idProyecto: proyecto._id }, { usuario: usuario.usuario }],
    });
    if (usuarioEnProyecto)
      return response.status(400).send("El usuario ya esta en el proyecto");
    const equipo = new Equipo({
      idProyecto: request.body.idProyecto,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cedula: usuario.cedula,
      usuario: usuario.usuario,
      contrasenia: usuario.contrasenia,
      rol: usuario.rol,
    });
    const result = await equipo.save();
    response.status(200).send(result);
  }
});
//Listar usuarios para el proyecto
router.get("/usuarios", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Scrum Master" || usuario.rol == "Lider Técnico") {
    const usuarios = await Usuario.find({
      $and: [
        { rol: { $nin: "Administrador" } },
        { usuario: { $nin: usuario.usuario } },
      ],
    });
    response.status(200).send(usuarios);
  } else {
    return response.status(400).send("No tiene los permisos necesarios");
  }
});
//Listar el equipo del proyecto
router.get("/listar/:idProyecto", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const equipo = await Equipo.find({ idProyecto: request.params.idProyecto });
  response.status(200).send(equipo);
});
//Eliminar usuario del equipos
router.delete("/borrar/:_id", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const equipo = await Equipo.findByIdAndDelete(request.params._id);
  if (!equipo) return response.status(400).send("El usuario no existe");
  response.status(200).send({ message: "Usuario eliminado del equipo" });
});
//Listar proyectos en los que este el usuario
router.get("/listarProyectos", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const equipo = await Equipo.find({ usuario: usuario.usuario });
  let array = [];
  for (let i = 0; i < equipo.length; i++) {
    array.push(await Proyecto.findById(equipo[i].idProyecto));
  }
  response.status(200).send(array);
});

module.exports = router;
