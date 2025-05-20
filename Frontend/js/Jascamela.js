const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Datos de ejemplo
let hamburguesas = [
  {
    id: 1,
    titulo: "Clásica",
    descripcion: "Deliciosa hamburguesa con carne de ternera, lechuga, tomate y queso cheddar.",
    imagen: "./Images/Clásica.png"
  },
  {
    id: 2,
    titulo: "BBQ",
    descripcion: "Jugosa hamburguesa con salsa BBQ, aros de cebolla y bacon crujiente.",
    imagen: "./Images/BBQ.png"
  },
  {
    id: 3,
    titulo: "Picapollo",
    descripcion: "Para los amantes del pollo: Hamburguesa de pollo, bacon, queso cheddar, jalapeños y salsa de chili rojo." ,
    imagen: "./Images/Picapollo.png"
  },
  {
    id: 4,
    titulo: "Pulled Pork",
    descripcion: "Sabrosa hamburguesa con cebolla pochada pulled pork hamburguesa de ternera queso y bacon.",
    imagen: "./Images/PulledPork.png"
  },
  {
    id:6,
    titulo: "Gluten Free",
    descripcion: "Tranquilos intolerantes al gluten aquí llega vuestra hamburguesa, con carne de res, queso cheddar, tomate, lechuga y cebolla caramelizada.",
    imagen: "./Images/Gluten.png"
  },
  {
    id:7,
    titulo: "Bacon Lovers",
    descripcion: "Extra de bacon para los verdaderos fans. ¡Irresistible!",
    imagen: "./Images/Bacon.png"
  },
  {
    id:8,
    titulo: "Vegan Pleasure",
    descripcion: "Opción 100% vegetal con ingredientes frescos y sabrosos.",
    imagen: "./Images/Vegana.png"
  },
  {
    id:9,
    titulo: "Marítima",
    descripcion: "El mar llega a tu hamburguesa, Filete de pescado crujiente, tomate, lechuga fresca y salsa tártara",
    imagen: "./Images/Maritima.png"
  },
  {
    id:10,
    titulo: "Friedstastic",
    descripcion: "Hamburguesa de res frita, pimiento rojo y queso feta",
    imagen: "./Images/.png"
  },
  {
    id:11,
    titulo: "Chef Alba's Burger",
    descripcion: "Hamburgesa de ternera con mermelada de tomate, cebolla caramelizada, rulo de cabra y trufa en polvo",
    imagen:"./Images/Alba.png"
  },
  {
    id:12,
    titulo: "La Soberana",
    descripcion: "Doble smash patty de res bien doradito, con costrita,Lonchas de panceta crujiente y Pulled pork glaseado con bourbon BBQ",
    imagen:"./Images/Soberana.png"
  },
  {
    id:13,
    titulo: "Taco Burger",
    descripcion: "Hamburguesa de res sazonada con comino, paprika, ajo en polvo y chile en polvo, Queso cheddar derretido, Queso Monterey Jack rallado encima, Mini tortilla crujiente encima del patty, rellena con carne deshebrada de res al estilo barbacoa o cochinita pibil Salsa roja o verde casera por encima",
    imagen:"./Images/TacoBurger.png"
  },
  {
    id:14,
    titulo: "Pizzabomba",
    descripcion: "Hamburguesa de res jugosa, sazonada con orégano, albahaca y un toque de ajo en polvo con queso mozzarella, Cucharada generosa de salsa marinara espesa, Un chorrito de aceite picante estilo napolitano",
    imagen:"./Images/Pizzabomba.png"
  },
  {
    id:15,
    titulo: "Pepe Roni",
    descripcion: "Con pepperoni, mozzarella fundida y un toque especiado estilo pizza.",
    imagen:"./Images/Pepperoni.png"
  },
  {
    id:16,
    titulo: "Batido Chocolate",
    descripcion: "Cremoso, frío y perfecto para acompañar cualquier burger ¡Sabor CHOCOLATEEE!",
    imagen:"./Images/BatidoChocolate.png"
  },
 

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
