import dotenv from "dotenv";
import express from "express";
import { randomUUID } from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "local.env") });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY not found in local.env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: { timeout: 30000 }
});
const app = express();

const PORT = process.env.PORT || 3000;
const MODEL = "gemini-3.5-flash-lite";
const MAX_HISTORY_MESSAGES = 12;

const conversations = new Map();

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `
You are Kryptix AI, a helpful and reliable AI assistant.

Help users with programming, technology, learning,
problem-solving and general questions.

Give clear, accurate and direct answers.
Explain difficult concepts simply.
Use examples when helpful.
Never invent facts.
Respect user privacy.
Never reveal API keys or confidential information.
`;

app.get("/health", (req, res) => {
  res.json({
    status: "running",
    application: "Kryptix AI",
    model: MODEL
  });
});

app.post("/chat", async (req, res) => {
  const { message, conversationId } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Please provide a valid message."
    });
  }

  if (message.length > 10000) {
    return res.status(400).json({
      error: "Message is too long. Maximum length is 10000 characters."
    });
  }

  const id = conversationId || randomUUID();

  if (typeof id !== "string" || id.length > 100) {
    return res.status(400).json({
      error: "Invalid conversation ID."
    });
  }

  if (!conversations.has(id)) {
    conversations.set(id, []);
  }

  const history = conversations.get(id);

  history.push({
    role: "user",
    parts: [{ text: message.trim() }]
  });

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: history,
      config: {
        systemInstruction: SYSTEM_PROMPT
      }
    });

    const reply = result.text?.trim();

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    history.push({
      role: "model",
      parts: [{ text: reply }]
    });

    if (history.length > MAX_HISTORY_MESSAGES) {
      history.splice(0, history.length - MAX_HISTORY_MESSAGES);
    }

    res.json({
      conversationId: id,
      reply,
      historyMessages: history.length
    });

  } catch (error) {
    history.pop();

    console.error("[API Error]", error.message);

    const status = Number(error.status || error.statusCode);
    const isTimeout =
      error.name === "AbortError" ||
      error.name === "TimeoutError" ||
      /timeout|aborted/i.test(error.message || "");

    if (isTimeout) {
      return res.status(504).json({
        error: "Kryptix AI took too long to respond. Please try again."
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "The AI service is receiving too many requests. Please try again."
      });
    }

    res.status(502).json({
      error: "Kryptix AI could not generate a response. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Kryptix AI API running at http://localhost:${PORT}`);
  console.log("POST /chat");
  console.log("GET /health");
});
