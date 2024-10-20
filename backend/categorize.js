const axios = require('axios');
const stringSimilarity = require('string-similarity');

const cleanResponse = (response) => {
  return response.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '').trim().toLowerCase();
};

const categorizePurchase = async (description, categories) => {
  const prompt = `
  Tengo una lista de categorías de compras: ${categories.join(', ')}.

  Por favor, clasifica la siguiente descripción de compra en una de esas categorías:

  Descripción: "${description}"

  Tene en cuenta que la mayoría de los usuarios son argentinos, por lo que la descripción pueden ser marcas argentinas

  Si la descripción no se ajusta a ninguna de las categorías proporcionadas, responde con "Otros". 
  Asegúrate de que la respuesta sea exactamente el nombre de la categoría y que esté en singular. No incluyas ningún comentario adicional ni texto extra.
  `;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2',
      prompt: prompt,
      stream: false
    });

    // Trim de la respuesta acumulada
    const fullResponse = String(response.data.response).trim(); // Asegúrate de acceder a la propiedad correcta

    // Limpiar la respuesta de la IA
    const cleanedResponse = cleanResponse(fullResponse);

    // Imprimir la respuesta completa para depuración
    console.log('Respuesta de la API para:', response.data, cleanedResponse, description);

    // Utiliza similitud de cadenas para encontrar la categoría más cercana
    const bestMatch = stringSimilarity.findBestMatch(cleanedResponse, categories);

    // Obtener la mejor coincidencia y su puntuación
    const { bestMatch: { target, rating } } = bestMatch;

    // Si la puntuación es suficientemente alta (ajusta el umbral si es necesario)
    const threshold = 0.6; // 60% de similitud
    if (rating >= threshold) {
      return target; // Retorna la categoría con mayor similitud
    } else {
      return "Otros"; // Si no encuentra una coincidencia suficientemente cercana
    }
  } catch (error) {
    console.error('Error al categorizar la compra:', error);
    return null;
  }
};

module.exports = { categorizePurchase };
