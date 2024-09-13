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

// Ruta para servir `index.html`
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir `recibo.html`
app.get("/recibo.html", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recibo.html'));
});

// Configura Nodemailer con variables de entorno
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
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
      from: `"Twodesigners" <${process.env.SMTP_USER}>`, // Emisor del correo usando la variable de entorno
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

// Escucha en el puerto asignado por Vercel
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
