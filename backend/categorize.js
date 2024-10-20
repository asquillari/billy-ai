const axios = require('axios');

const categorizePurchase = async (description, categories) => {
  const prompt = `Dada esta lista de categorías: ${categories.join(', ')}. Clasifica la siguiente descripción de compra en una de esas categorías: "${description}".
  Responde solo con el nombre de la categoría, sin ningún comentario adicional.
  En caso de no saber la categoría, responde "Otros".`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2',
      prompt: prompt,
      stream: false
    });


    // Trim de la respuesta acumulada
    const fullResponse = String(response.data.response).trim(); // Asegúrate de acceder a la propiedad correcta

    // Imprimir la respuesta completa para depuración
    console.log('Respuesta de la API para:', response.data, fullResponse, description);

    // Convertir categorías a un Set para búsquedas más rápidas
    const categorySet = new Set(categories.map(cat => cat.toLowerCase()));

    // Función para verificar si una categoría existe, ignorando mayúsculas y minúsculas
    const categoryExists = (category, categorySet, originalCategories) => {
        const lowerCaseCategory = category.toLowerCase();
        return categorySet.has(lowerCaseCategory) ? originalCategories[Array.from(categorySet).indexOf(lowerCaseCategory)] : null; // Devuelve la categoría original si se encuentra
    };

    // Limitar la respuesta a una sola palabra
    const singleWordResponse = fullResponse.split(' ')[0]; // Toma solo la primera palabra

    // Verificar si la respuesta es una categoría válida
    const matchedCategory = categoryExists(singleWordResponse, categorySet, categories);
    if (matchedCategory) {
        return matchedCategory; // Devuelve la categoría tal como estaba escrita
    } else {
        return "Otros"; // Opción por defecto
    }
  } catch (error) {
    console.error('Error al categorizar la compra:', error);
    return null;
  }
};

module.exports = { categorizePurchase };
