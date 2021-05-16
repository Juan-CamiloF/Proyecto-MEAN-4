//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Proyecto } = require("../models/proyectos");
const { Usuario } = require("../models/usuario");
const auth = require("../middleware/auth");
//Rutas
//Creación de proyectos
router.post("/crear", auth, async (request, response) => {
  //Buscar si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Scrum Master" || usuario.rol == "Lider técnico") {
  const creador = usuario.nombres +' '+ usuario.apellidos + ' ('+usuario.rol+')'
    const proyecto = new Proyecto({
      idUsuario: usuario._id,
      creador:creador,
      nombre: request.body.nombre,
      fechaDeInicio: request.body.fechaDeInicio,
      fechaDeFin: request.body.fechaDeFin,
      estado: request.body.estado,
      fechaCreacion: Date.now(),
    });
    //Guardar proyecto
    const result = await proyecto.save();
    response.status(200).send(result);
  } else {
    return response.status(400).send("No tiene los permisos necesarios");
  }
});
//Lista de proyectos propios
router.get("/listar", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Scrum Master" || usuario.rol == "Lider técnico") {
    const proyecto = await Proyecto.find({
      idUsuario: request.usuario._id,
    }).sort({ fechaCreacion: 1 });
    response.status(200).send(proyecto);
  } else {
    return response.status(400).send("El usuario no existe");
  }
});
//Lista de todos los proyectos
router.get("/listarTodos", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Administrador") {
    const proyectos = await Proyecto.find().sort({ fechaCreacion: 1 });
    response.status(200).send(proyectos);
  } else {
    return response.status(400).send("No tiene los permisos necesarios");
  }
});
//Actualizar proyectos
router.put("/actualizar", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Scrum Master" || usuario.rol == "Lider técnico") {
    const proyecto = await Proyecto.findByIdAndUpdate(
      request.body._id,
      {
        idUsuario: usuario._id,
        nombre: request.body.nombre,
        fechaDeInicio: request.body.fechaDeInicio,
        fechaDeFin: request.body.fechaDeFin,
        estado: request.body.estado,
      },
      {
        new: true,
      }
    );
    const result = await proyecto.save();
    response.status(200).send(result);
  } else {
    response.status(400).send("No tiene los permisos necesarios");
  }
});
//Eliminar proyectos
router.delete("/borrar/:_id", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  if (!usuario) return response.status(400).send("El usuario no existe");
  if (usuario.rol == "Scrum Master" || usuario.rol == "Lider técnico") {
    const result = await Proyecto.findByIdAndDelete(request.params._id);
    if (!result) response.status(400).send("No existe el proyecto");
    response.status(400).send({ message: "Proyecto eliminado" });
  } else {
    return response.status(400).send("No tiene los permisos necesarios");
  }
});
module.exports = router;
