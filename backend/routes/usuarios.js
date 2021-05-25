//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Usuario } = require("../models/usuario");
const { Proyecto } = require("../models/proyectos");
const { Equipo } = require("../models/equipos");
const auth = require("../middleware/auth");
//Rutas
//Crear un administrador
router.post("/registrarAdmin", async (request, response) => {
  let admin = await Usuario.findOne({ rol: "Administrador" });
  if (admin) return response.status(400).send("Ya existe un administrador");
  admin = new Usuario({
    usuario: request.body.usuario,
    contrasenia: request.body.contrasenia,
    rol: "Administrador",
  });
  let save = admin.save();
  response.status(200).send({ message: "Administrador creado con éxito" });
});
//Registrar los usuarios
router.post("/registrarUsuarios", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  //Si no existe el usuario
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Si es administrador
  if (request.usuario.rol === "Administrador") {
    //Buscar si ya existe el usuario
    let usuario = await Usuario.findOne({ usuario: request.body.usuario });
    //Si existe
    if (usuario) return response.status(400).send("El usuario ya existe");
    //Si no existe
    usuario = new Usuario({
      nombres: request.body.nombres,
      apellidos: request.body.apellidos,
      cedula: request.body.cedula,
      usuario: request.body.usuario,
      contrasenia: request.body.contrasenia,
      rol: request.body.rol,
    });
    //Guardar el usuario
    const save = await usuario.save();
    //Generar token
    const token = usuario.generateJWT();
    response.status(200).send({ token });
  } else {
    response.status(401).send("No tiene permisos necesarios");
  }
});
//Listar los usuarios
router.get("/listarUsuarios", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  //Si no existe el usuario
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Si es administrador
  if (usuario.rol === "Administrador") {
    const usuarios = await Usuario.find().sort({ rol: 1 });
    response.status(200).send(usuarios);
  } else {
    return response.status(401).send("No tiene permisos necesarios");
  }
});
//Actualizar los usuarios
router.put("/actualizarUsuarios", auth, async (request, response) => {
  //Si existe el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  //Si no existe el usuario
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Si es administrador
  if (usuario.rol === "Administrador") {
    //Buscar si existe el usuario
    const usuario = await Usuario.findById(request.body._id);
    //Si no existe el usuario
    if (!usuario) return response.status(400).send("El usuario no existe");
    //Si existe actualizar sus datos
    if (usuario.usuario == request.body.usuario) {
      const newUsuario = await Usuario.findByIdAndUpdate(
        request.body._id,
        {
          nombres: request.body.nombres,
          apellidos: request.body.apellidos,
          cedula: request.body.cedula,
          usuario: usuario.usuario,
          contrasenia: request.body.contrasenia,
          rol: request.body.rol,
        },
        { new: true }
      );
      //Guardar el usuario
      const save = newUsuario.save();
      response.status(200).send(newUsuario);
    }
    if (usuario.usuario !== request.body.usuario) {
      const existe = await Usuario.findOne({ usuario: request.body.usuario });
      if (existe) return response.status(400).send("El usuario ya existe");
      const newUsuario = await Usuario.findByIdAndUpdate(
        request.body._id,
        {
          nombres: request.body.nombres,
          apellidos: request.body.apellidos,
          cedula: request.body.cedula,
          usuario: request.body.usuario,
          contrasenia: request.body.contrasenia,
          rol: request.body.rol,
        },
        { new: true }
      );
      //Guardar el usuario
      const save = newUsuario.save();
      response.status(200).send(newUsuario);
    }
  } else {
    response.status(401).send("No tiene los permisos necesarios");
  }
});
//Eliminar los usuarios
router.delete("/borrar/:_id", auth, async (request, response) => {
  //Buscar el usuario
  const usuario = await Usuario.findById(request.usuario._id);
  //Si no existe
  if (!usuario) return response.status(400).send("El usuario no existe");
  //Si es administrador
  if (usuario.rol == "Administrador") {
    //Buscar el usuario a eliminar
    const usuario = await Usuario.findById(request.params._id);
    if (!usuario) return response.status(400).send("El usuario no existe");
    //Si pertenece a un proyecto no se elimina
    const proyectos = await Proyecto.findOne({ idUsuario: usuario._id });
    if (proyectos) return response.status(406).send("No se puede eliminar el usuario es creador de un proyectos");
    //Si pertenece a un equipo
    const equipo = await Equipo.findOne({ usuario: usuario.usuario });
    if (equipo)
      return response
        .status(406)
        .send("No se puede eliminar el usuario, pertenece a un proyecto");
    const eliminar = await Usuario.findByIdAndDelete(request.params._id);
    if(!eliminar) return response.status(400).send('No se pudo eliminar')
    response.status(200).send({ message: "Usuario eliminado" });
  } else {
    response.status(401).send("No tiene los permisos necesarios");
  }
});

//Exportar router
module.exports = router;
