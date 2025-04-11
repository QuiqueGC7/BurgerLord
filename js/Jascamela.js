const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Datos de ejemplo
let hamburguesas = [
  {
    id: 1,
    titulo: "Hamburguesa Clásica",
    descripcion: "Deliciosa hamburguesa con carne de ternera, lechuga, tomate y queso cheddar.",
    imagen: "./Images/Clásica.png"
  },
  {
    id: 2,
    titulo: "Hamburguesa BBQ",
    descripcion: "Jugosa hamburguesa con salsa BBQ, aros de cebolla y bacon crujiente.",
    imagen: "./Images/BBQ.png"
  },
  {
    id: 3,
    titulo: "Hamburguesa Picapollo",
    descripcion: "Para los amantes del pollo: Hamburguesa de pollo, bacon, queso cheddar, jalapeños y salsa de chili rojo" ,
    imagen: "./Images/Picapollo.png"
  }
    

];

// Rutas

// Obtener todas las hamburguesas
app.get('/hamburguesas', (req, res) => {
  res.json(hamburguesas);
});

// Obtener una hamburguesa por ID
app.get('/hamburguesas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hamburguesa = hamburguesas.find(h => h.id === id);
  if (hamburguesa) {
    res.json(hamburguesa);
  } else {
    res.status(404).json({ mensaje: "Hamburguesa no encontrada" });
  }
});

// Agregar una nueva hamburguesa
/*app.post('/hamburguesas', (req, res) => {
  const nuevaHamburguesa = {
    id: hamburguesas.length + 1,
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    imagen: req.body.imagen
  };
  hamburguesas.push(nuevaHamburguesa);
  res.status(201).json(nuevaHamburguesa);
});*/

// Iniciar el servidor
/*app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});*/
