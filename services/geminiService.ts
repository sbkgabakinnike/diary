import { GoogleGenAI } from "@google/genai";

export const getGeminiReflection = async (content: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found");
    return "API Key is missing.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a thoughtful, empathetic diary assistant. 
      Read the following diary entry and provide a short, warm, 1-sentence reflection or encouraging comment in Korean.
      
      Diary Entry:
      "${content}"`,
    });

    return response.text || "생각을 정리하는 중입니다...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스를 현재 이용할 수 없습니다.";
  }
};
