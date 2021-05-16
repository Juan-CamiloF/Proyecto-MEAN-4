//Modulo interno jwt
const jwt = require("jsonwebtoken");
//Crear funcion para autenticacion
function auth(request, response, next) {
  //Traer el token guardado
  let jwtoken = request.header("Authorization");
  //Separar el bearer del token
  if(!jwtoken) return response.status(400).send('No hay token para acceso')
  jwtoken = jwtoken.split(" ")[1];
  //Si no existe token
  if (!jwtoken) {
    return response.status(400).send("No hay token de acceso");
  }
  //Si existe verificar el token
  try {
    const payload = jwt.verify(jwtoken, "scrum");
    request.usuario = payload;
    next();
  } catch (err) {
    response.status(400).send("Token invalido");
    // console.log(err)
  }
}
module.exports = auth;
