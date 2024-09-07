const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

// Inicializa la app de Express
const app = express();

// Habilita CORS
app.use(cors());

// Middleware para analizar JSON
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, imágenes, etc.)
app.use(express.static(path.join(__dirname)));

// Configura Nodemailer
let transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "pagosyrecibos@twodesigners.online",
    pass: "5UuG|pZ$",
  },
});

// Ruta para manejar el envío del recibo
app.post("/send-receipt", (req, res) => {
  const { name, email, address, concept, amount } = req.body;

  // Lee el archivo HTML del template
  fs.readFile(
    path.join(__dirname, "emailTemplate.html"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error al enviar el correo" });
      }

      // Formatea el importe a moneda con decimales correctos
      const formattedAmount = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(amount);

      // Reemplaza los marcadores con los valores dinámicos
      let htmlTemplate = data
        .replace("{{name}}", name)
        .replace("{{email}}", email)
        .replace("{{address}}", address)
        .replace("{{concept}}", concept)
        .replace("{{amount}}", formattedAmount); // Usa formattedAmount

      // Opciones del correo
      let mailOptions = {
        from: '"Twodesigners" <pagosyrecibos@twodesigners.online>',
        to: email,
        subject: `🪙 Hemos recibido tu pago, ${name}`,
        html: htmlTemplate,
      };

      // Envía el correo
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error al enviar el correo:", error);
          return res
            .status(500)
            .json({ success: false, message: "Error al enviar el correo" });
        }
        console.log("Correo enviado: " + info.response);
        res
          .status(200)
          .json({ success: true, message: "Recibo enviado correctamente" });
      });
    }
  );
});

// No agregues app.listen en Vercel

module.exports = app; // Exporta la app para que Vercel la use
