// Punto de entrada principal de la aplicación Express
// Configura middlewares, rutas y manejo de errores

// Importar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Crear una instancia de la aplicación Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

// Exportar la aplicación para ser utilizada en otros módulos
module.exports = app;