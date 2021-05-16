//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Usuario } = require("../models/usuario");
const { Sprint } = require("../models/sprints");
const { Proyecto } = require("../models/proyectos");
const auth = require("../middleware/auth");
const { Actividad } = require("../models/actividades");
//Creación de rutas
//Crear Sprint
router.post("/crear", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Si existe el proyecto
  const proyecto = await Proyecto.findById(request.body.idProyecto);
  if(!proyecto) return response.status(400).send('El proyecto no existe');
  const sprint = new Sprint({
    idProyecto: proyecto._id,
    sprint: request.body.sprint,
    nombre: request.body.nombre,
    duracion: request.body.duracion,
    estado: 'Asignado',
  });
  const save = await sprint.save();
  response.status(200).send(save);
});
//Listar Sprints
router.get("/listar/:idProyecto", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Buscar el proyecto
  const proyecto = await Proyecto.findById(request.params.idProyecto);
  if (!proyecto) return response.status(400).send("El proyecto no existe");
  const sprints = await Sprint.find({ idProyecto: request.params.idProyecto });
  response.status(200).send(sprints);
});
//Actualizar sprints
router.put("/actualizar", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Actualizar
  const sprint = await Sprint.findByIdAndUpdate(
    request.body._id,
    {
      sprint: request.body.sprint,
      nombre: request.body.nombre,
      fechaInicio: request.body.fechaInicio,
      fechaFin: request.body.fechaFin,
      estado: request.body.estado,
    },
    {
      new: true,
    }
  );
  const save = await sprint.save();
  response.status(200).send(sprint)
});
//Eliminar Sprints
router.delete("/borrar/:_id", auth, async (request, response) => {
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  const sprint = await Sprint.findByIdAndDelete(request.params._id);
  if (!sprint) return response.status(400).send("El Sprint no existe");
  response.status(200).send({ message: "Sprint Eliminado" });
});
//Mostrar tareas del sprint
router.get("/listarTareas/:idSprint",auth,async(request,response)=>{
  //Si el usuario existe
  const usuario = await Usuario.findById(request.usuario._id);
  if(!usuario)  return response.status(400).send(200);
  const tareas = await Actividad.find({idSprint:request.params.idSprint});
  response.status(200).send(tareas);
})
module.exports = router;
