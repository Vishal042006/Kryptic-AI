import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: "./local.env" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY missing in local.env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

try {
  console.log("Connecting to Gemini API...");

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "Say hello in one sentence."
  });

  console.log("✅ Gemini API connected successfully!");
  console.log("Response:", response.text);
} catch (error) {
  console.error("❌ API Error:", error.message);
}
