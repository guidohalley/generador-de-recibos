# Generador de Recibos
# Generador de Recibos

Este proyecto es un **Generador de Recibos** que permite a los usuarios generar y enviar recibos de pago por correo electrónico. Está construido con **Node.js**, **Express**, **Nodemailer** y está desplegado en **Vercel**. El frontend incluye un formulario para enviar los detalles del recibo, mientras que el backend se encarga de procesar los datos y enviar el correo.

## Características

- **Formulario interactivo**: Permite a los usuarios ingresar datos como nombre, correo, dirección, concepto, e importe.
- **Envío de correos**: Utiliza **Nodemailer** para enviar el recibo a la dirección de correo ingresada.
- **Plantilla de correo personalizada**: Los recibos se envían en formato HTML usando una plantilla personalizada.
- **Desplegado en Vercel**: El proyecto está desplegado en la plataforma **Vercel**, lo que permite tener una URL pública y accesible para el servicio.

## Requisitos

- **Node.js** (v12 o superior)
- **NPM** (v6 o superior)

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tu-usuario/generador-de-recibos.git
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd generador-de-recibos
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Configura las credenciales de Nodemailer en tu archivo `.env`. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (reemplaza con tus credenciales de Hostinger o el servicio SMTP que utilices):

    ```env
    SMTP_HOST=smtp.hostinger.com
    SMTP_PORT=465
    SMTP_USER=pagosyrecibos@twodesigners.online
    SMTP_PASS=5UuG|pZ$
    ```

## Uso

### Localmente

Para correr el proyecto localmente, sigue estos pasos:

1. Ejecuta el servidor:

    ```bash
    npm run dev
    ```

2. Abre tu navegador y navega a `http://localhost:3000/recibo.html` para acceder al formulario y generar recibos.

### Despliegue en Vercel

El proyecto está configurado para ser desplegado en Vercel. Sigue estos pasos para desplegarlo en Vercel:

1. Conéctate a tu cuenta de Vercel y selecciona el repositorio desde el cual quieres desplegar el proyecto.
2. Asegúrate de que la estructura de tu proyecto incluya los archivos API en una carpeta `api/` y un archivo `vercel.json` con la configuración adecuada.

    ```json
    {
      "version": 2,
      "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
      "routes": [{ "src": "/send-receipt", "dest": "/api/index.js" }]
    }
    ```

El formulario estará accesible desde la URL pública de Vercel una vez desplegado correctamente.

## Estructura del Proyecto

```bash
/public
    /recibo.html    # Formulario HTML para generar recibos
/api
    /index.js       # Backend con Express y Nodemailer
/emailTemplate.html # Plantilla HTML para el correo del recibo
```

## Notas Importantes

- No uses `app.listen` en Vercel, ya que las funciones de API se manejan automáticamente como serverless functions.
- Asegúrate de que el archivo `emailTemplate.html` esté en la ruta correcta en el servidor para evitar errores al enviar el correo.
- Los problemas relacionados con CORS ya han sido gestionados mediante la configuración de CORS en Express.

## Contribuciones

Si deseas contribuir a este proyecto, por favor, abre un pull request o crea un issue en el repositorio.
