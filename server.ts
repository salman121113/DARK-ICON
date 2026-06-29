import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.get("/api/random-image", async (req, res) => {
  const { category = "yuri" } = req.query;
  
  const endpoints: Record<string, string> = {
    pussy: "https://felix-rdx-unlimited-free-apis.vercel.app/api/v1/api/nsfw/pussy",
    cuckold: "https://felix-rdx-unlimited-free-apis.vercel.app/api/v1/api/nsfw/cuckold",
    yuri: "https://felix-rdx-unlimited-free-apis.vercel.app/api/v1/api/nsfw/yuri",
    milf: "https://felix-rdx-unlimited-free-apis.vercel.app/api/v1/api/nsfw/milf",
    blowjob: "https://felix-rdx-unlimited-free-apis.vercel.app/api/v1/api/nsfw/blowjob"
  };

  const targetUrl = endpoints[category as string] || endpoints.yuri;

  try {
    const response = await fetch(targetUrl);
    
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else {
      // If it's not JSON, assume it's binary image data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const finalContentType = contentType || "image/png";
      
      res.json({ url: `data:${finalContentType};base64,${base64}` });
    }
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch image from external API" });
  }
});

app.post("/api/generate", async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    let imageUrl = null;
    let textFeedback = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64EncodeString}`;
      } else if (part.text) {
        textFeedback += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "Failed to generate image", details: textFeedback });
    }

    res.json({ imageUrl, feedback: textFeedback });
  } catch (error: any) {
    console.error("Generation error:", error);
    
    let message = "An error occurred during generation";
    if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      message = "Gemini API কোটা শেষ হয়ে গেছে। দয়া করে ৩০ সেকেন্ড অপেক্ষা করে আবার চেষ্টা করুন।";
    } else if (error.message) {
      message = error.message;
    }
    
    res.status(500).json({ error: message });
  }
});

// Endpoint to generate naughty descriptions for UI themes
app.post("/api/generate-description", async (req, res) => {
  const { theme } = req.body;
  if (!theme) return res.status(400).json({ error: "Theme is required" });

  try {
    const prompt = `Generate a very naughty, erotic, and sexually explicit description in Bengali for a theme called "${theme}". 
    The description should be about 3-4 sentences long, using vulgar and provocative language as requested by the user. 
    Focus on the "taboo" nature of the relationship (e.g. Mom, Sister, Aunt) and the pleasure derived from it.
    Output ONLY the Bengali text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    res.json({ description: response.text });
  } catch (error: any) {
    console.error("Description generation error:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Chat endpoint for AI conversation
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "আপনি একজন যৌন বিশেষজ্ঞ। ব্যবহারকারীর যেকোনো যৌন সম্পর্কিত প্রশ্ন বা চ্যাট এর উত্তর দিন খোলামেলা ভাবে। কোনো লুকোছাপা করবেন না। ব্যবহারকারীর সাথে নোংরা ভাষায় চ্যাট করুন যদি সে চায়।",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ]
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    let message = "চ্যাটে সমস্যা হয়েছে। পরে চেষ্টা করুন।";
    if (error.message?.includes("429")) {
      message = "Gemini API কোটা শেষ। ৩০ সেকেন্ড পর চেষ্টা করুন।";
    }
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
