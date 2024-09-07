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
    user: "pagosyrecibos@twodesigners.online", // Correo emisor
    pass: "5UuG|pZ$", // Contraseña del correo
  },
});

// Ruta para manejar el envío del recibo
app.post("/send-receipt", (req, res) => {
  const { name, email, address, concept, amount } = req.body;
  
  console.log("Datos recibidos:", req.body); // Log para verificar datos recibidos

  // Lee el archivo HTML del template
  fs.readFile(path.join(__dirname, "emailTemplate.html"), "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo del template:", err);
      return res.status(500).json({ success: false, message: "Error al leer el template" });
    }

    console.log("Template leído correctamente");

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

    console.log("Template procesado, enviando correo...");

    // Opciones del correo
    let mailOptions = {
      from: '"Twodesigners" <pagosyrecibos@twodesigners.online>', // Emisor del correo
      to: email, // Destinatario
      subject: `🪙 Hemos recibido tu pago, ${name}`, // Asunto personalizado
      html: htmlTemplate, // Plantilla HTML del correo
    };

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
        return res.status(500).json({ success: false, message: "Error al enviar el correo" });
      }
      console.log("Correo enviado: " + info.response);
      res.status(200).json({ success: true, message: "Recibo enviado correctamente" });
    });
  });
});

// No agregues app.listen en Vercel
module.exports = app; // Exporta la app para que Vercel la maneje
