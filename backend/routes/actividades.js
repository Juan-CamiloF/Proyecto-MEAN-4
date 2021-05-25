//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Actividad } = require("../models/actividades");
const { Sprint } = require("../models/sprints");
const { Equipo } = require("../models/equipos");
const { Usuario } = require("../models/usuario");
const { Proyecto } = require("../models/proyectos");
const auth = require("../middleware/auth");
//Rutas
//Crear actividades
router.post("/crear/", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const sprint = await Sprint.findById(request.body.idSprint);
  if (!sprint) return response.status(400).send("No existe el sprint");
  const proyecto = await Proyecto.findById(sprint.idProyecto);
  if (!proyecto) return response.status(400).send("El Proyecto no existe");
  const equipo = await Equipo.findOne({
    $and: [{ idProyecto: proyecto._id }, { usuario: usuario.usuario }],
  });
  if (!equipo) return response.status(400).send("El equipo no existe");
  // //Crear actividad
  const encargado =
    usuario.nombres + " " + usuario.apellidos + " " + "(" + usuario.rol + ")";
  const actividad = new Actividad({
    idSprint: sprint._id,
    idEquipo: equipo._id,
    nombre: request.body.nombre,
    prioridad: request.body.prioridad,
    descripcion: request.body.descripcion,
    estado: "Asignada",
    encargado: encargado,
  });
  const save = await actividad.save();
  response.status(200).send(actividad);
});
//Listar actividades propias por Sprint
router.get("/listar/:idSprint", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const sprint = await Sprint.findById(request.params.idSprint);
  if (!sprint) return response.status(400).send("El Sprint no existe");
  const proyecto = await Proyecto.findById(sprint.idProyecto);
  if (!proyecto) return response.status(400).send("El proyecto no existe");
  const equipo = await Equipo.findOne({
    $and: [{ idProyecto: proyecto._id }, { usuario: usuario.usuario }],
  });
  if (!equipo) return response.status(400).send("El equipo no existe");
  const actividades = await Actividad.find({
    $and: [{ idSprint: sprint._id }, { idEquipo: equipo._id }],
  });
  response.status(200).send(actividades);
});
//Borrar actividades
router.delete("/borrar/:_id", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) response.status(400).send("El usuario no existe");
  const tarea = await Actividad.findByIdAndDelete(request.params._id);
  if (!tarea) response.status(400).send("La actividad no existe");
  response.status(200).send({ message: "Actividad eliminada" });
});
//Actualizar actividades
router.put("/actualizar", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) response.status(400).send("El usuario no existe");
  const tarea = await Actividad.findByIdAndUpdate(
    request.body._id,
    {
      nombre: request.body.nombre,
      prioridad: request.body.prioridad,
      descripcion: request.body.descripcion,
    },
    { new: true }
  );
  if(!tarea) return response.status(400).send('La tarea no existe');
  response.status(200).send(tarea);
});
module.exports = router;
