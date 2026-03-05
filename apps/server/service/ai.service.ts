import { GoogleGenAI, Type } from "@google/genai";
import { GET_CLASSIFICATION } from "../utils/prompt";

class AIService {
  availableKey: string;
  model: GoogleGenAI;
  jsonModel: GoogleGenAI;
  modelVersion: string;
  constructor() {
    this.availableKey = process.env.AI_API_KEY!;
    this.model = new GoogleGenAI({ apiKey: this.availableKey });
    this.jsonModel = new GoogleGenAI({ apiKey: this.availableKey });
    this.modelVersion = "gemini-2.5-flash";
  }

  async getClassification(language: string[]) {
    try {
      let prompt = GET_CLASSIFICATION;
      prompt = prompt.replace("_languages_", JSON.stringify(language));
      let response = await this.model.models.generateContent({
        model: this.modelVersion,
        contents: prompt,
      });
      let yamlText = response.text || "";
      yamlText = yamlText.replace("```yaml", "```");
      yamlText = yamlText.replaceAll("```", "");

      return yamlText;
    } catch (error) {
      console.error("AI error:", error);
      return "";
    }
  }
}

export default new AIService();
