import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: "./local.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function benchmark() {
  console.log("\nTesting Gemini with LOW thinking effort...");

  const start = Date.now();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: "Reply with only OK.",
      config: {
        thinkingConfig: {
          thinkingLevel: "LOW",
        },
        maxOutputTokens: 100,
      },
    });

    console.log("Response:", response.text);
    console.log(
      "Response time:",
      ((Date.now() - start) / 1000).toFixed(2),
      "seconds"
    );

  } catch (error) {
    console.error("Error:", error.message);
  }
}

benchmark();
