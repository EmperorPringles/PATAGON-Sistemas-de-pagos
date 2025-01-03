import axios from "axios";
import User from "../models/user.js";
import Requests from "../models/requests.js";
import { sendEmail } from "./nodeMailer.js";

// Función auxiliar para obtener la clave pública sin salto de línea
export async function getPublicKeyFromDatabase(requestId) {
  try {
      const request = await Requests.findByPk(requestId);

      if (!request || !request.documento_pub) {
          throw new Error('Llave pública no encontrada');
      }
      return request.documento_pub.toString('utf-8').trim();
  } catch (error) {
      console.error('Error al obtener la llave pública:', error);
      throw error;
  }
}


//Nuevo usuario en patagón, llamada a api
export async function newUserCreationPatagon(req, res) {

 
  const { nombre, apellido, institucion, email, requestId, username, account, type } = req.body;
  console.log(req.body);
  try {

      //verificar si el usuario con el email ya existe
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) { 
          return res.status(400).json({ error: "El correo ya está registrado" });
      }

      // Usar la función auxiliar para obtener la clave pública en texto
      const key = await getPublicKeyFromDatabase(requestId);

      // const apiExternal = await axios.post('https://api.externaservicio.com/endpoint', {
      //     nombre,
      //     apellido,
      //     institucion,
      //     email,
      //     key, // Incluye la clave pública extraída
      //     username,
      //     account
      // });

      //registar el nuevo usuario y obtener su ID
      const newUser = await User.create({
          email: email,
          nombre: nombre + ' ' + apellido,
          rol: "Cliente",
          username: username,
          type: type,
      });
      
      await Requests.update(
          { user_id: newUser.ID, estado: 'aceptado' },  
          {
              where: {
                  email: email,          
                  estado: 'pendiente',  
              },
          }
      );
      //res.status(200).json(apiExternal.data);
      console.log(key);
      res.status(200).json({ mensaje: 'Clave pública obtenida correctamente', publicKey: key });
  } catch (error) {
      console.error('Error llamando a la API externa:', error);
      res.status(500).json({ mensaje: 'Error al contactar con la API externa' });
  }
};


//Rechazar solicitud
export async function rejectRequest(req, res) {
  const { requestId, reason, nombre, email } = req.body;
  try {
      await Requests.update(
        { estado: 'rechazado' },
        {
          where: {
            ID_request: requestId,
            estado: 'pendiente'
          }
        }
      );

      // Crear el objeto mailOptions
      const mailOptions = {
        to: email,
        subject: `[Patagón] Respuesta solicitud de uso ${nombre}, Universidad Austral de Chile`,
        message: `
              Estimad@ ${nombre},

              Tu solicitud fue rechazada 

              Motivo: ${reason}
              
              Si tienes alguna pregunta o crees que se trata de un error, puedes contactarnos respondiendo a este correo o utilizando el formulario de contacto en nuestro sitio web.

              Saludos cordiales,

              --
              Supercomputador Patagón
              Universidad Austral de Chile
              Website: https://patagon.uach.cl
              Tutorials: https://patagon.uach.cl/patagon/tutoriales
              Discord: https://discord.gg/WvFTPvvWXh
          `
      };
      sendEmail(mailOptions, res);
      res.status(200).json({ mensaje: 'Solicitud rechazada' });
  } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      res.status(500).json({ mensaje: 'Error al rechazar la solicitud' });
  }
};