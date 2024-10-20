// server.js
const express = require('express');
const { categorizePurchase } = require('./categorize'); // Importar la función

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Servidor en funcionamiento!');
});

// Endpoint para categorizar compras
app.post('/categorize', async (req, res) => {
  const { description, categories } = req.body;

  try {
    const category = await categorizePurchase(description, categories);
    return res.json({ category });
  } catch (error) {
    console.error('Error al categorizar la compra:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
