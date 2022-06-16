import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    //codigo copiado desde https://mailtrap.io/inboxes/1776198/messages
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      //********************** */

      //Enviar el email
      //console.log(datos);
      const {nombre, email, token} = datos;

      const info = await transport.sendMail({
          from: "APV - Administrador de Pacientes de  Veterinaria",
          to: email,
          subject: "comprueba tu cuenta en APV",
          text: 'Comprueba tu cuenta en APV',
          html: `<p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
          <p>Tu cuenta ya está lista, sólo debes comprobarla en el siguiente enlace:
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a> </p>
          <p> Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
          `,
      });

      //console.log("Mensaje enviado %s", info.messageId)

}

export default emailRegistro;