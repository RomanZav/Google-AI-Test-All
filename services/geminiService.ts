
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Transaction } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInventory = async (products: Product[], transactions: Transaction[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Аналізуй цей складський інвентар та історію транзакцій. 
        Інвентар: ${JSON.stringify(products)}
        Транзакції: ${JSON.stringify(transactions)}
        
        Надай відповідь у форматі JSON з наступними полями:
        - summary: короткий огляд стану складу
        - warnings: список критичних зауважень (низький запас, неходові товари)
        - suggestions: поради щодо оптимізації закупівель або розміщення
        - forecast: короткий прогноз попиту на наступний місяць
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            warnings: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            forecast: { type: Type.STRING }
          },
          required: ["summary", "warnings", "suggestions", "forecast"]
        }
      }
    });

    // The GenerateContentResponse features a text property (not a method)
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};

export const chatWithInventory = async (query: string, products: Product[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Ти - інтелектуальний помічник складу. Ось поточні дані: ${JSON.stringify(products)}.
        Користувач запитує: "${query}".
        Відповідай українською мовою лаконічно та професійно.
      `
    });
    // The GenerateContentResponse features a text property (not a method)
    return response.text || "Вибачте, сталася помилка при отриманні відповіді.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Вибачте, сталася помилка при обробці запиту.";
  }
};
