import ollama from 'ollama';

interface OllamaResponse {
  answer: string;
}

export const categorizePurchase = async (description: string, categories: string[]): Promise<string | null> => {
  const prompt = `
  Tengo una lista de categorías de compras: ${categories.join(', ')}.
  Clasifica la siguiente descripción de compra en una de esas categorías:

  Descripción: "${description}"

  Responde solo con el nombre de la categoría.
  `;

  try {
    // Generar la respuesta usando la API de Ollama
    const output: any = await ollama.generate({
      model: 'mistral', // El modelo que deseas utilizar
      prompt: prompt
    });

    // Verificar que output sea una cadena
    const category = typeof output === 'string' ? output.trim() : '';

    // Verificar si la respuesta está en las categorías proporcionadas
    if (categories.includes(category)) {
      console.log('Categoría asignada:', category);
      return category;
    } else {
      console.log('Categoría no reconocida, asignando a "Otros"');
      return "Otros";
    }
  } catch (error) {
    console.error('Error al categorizar la compra:', error);
    return null;
  }
};
