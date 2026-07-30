import express from "express";
import net from "net";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Mongoose Contact Schema & Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

async function findAvailablePort(startPort: number, hosts: string[]) {
  for (let port = startPort; port < startPort + 50; port++) {
    const availableEverywhere = await Promise.all(
      hosts.map(
        (host) =>
          new Promise<boolean>((resolve) => {
            const tester = net
              .createServer()
              .once("error", (err: any) => {
                if (err?.code === "EADDRINUSE") resolve(false);
                else resolve(true);
              })
              .once("listening", () => {
                tester.close(() => resolve(true));
              })
              .listen(port, host);
          }),
      ),
    );

    if (availableEverywhere.every(Boolean)) return port;
  }

  throw new Error(`No available port found starting from ${startPort}`);
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn("MONGODB_URI is not defined in environment variables.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to MongoDB.");

    // Create an initial document so 'tanmoy_portfolio' DB & 'contacts' collection show up in MongoDB Compass immediately
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.create({
        name: "System Welcome",
        email: "tanmoypal30102004@gmail.com",
        subject: "Portfolio Database Initialized",
        message: "Welcome to Tanmoy Pal's developer portfolio database! Mongoose is successfully connected.",
      });
      console.log("Created initial document in 'contacts' collection so database 'tanmoy_portfolio' appears in MongoDB Compass.");
    }
  } catch (error) {
    console.error("MongoDB connection failure:", error);
  }
}

async function startServer() {
  await connectDB();

  const app = express();
  const HOST = process.env.HOST || "0.0.0.0";
  const basePort = Number(process.env.PORT || 5000);
  
  // In production (e.g. Render/Cloud Run), use assigned PORT directly. In local dev, find available port.
  let PORT = basePort;
  if (process.env.NODE_ENV !== "production" && !process.env.PORT) {
    const hostsToCheck = HOST === "0.0.0.0" ? [HOST, "::"] : [HOST];
    PORT = await findAvailablePort(basePort, hostsToCheck);
  }

  app.use(express.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  });

  // API Contact Endpoint to save messages to MongoDB
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }
      const newContact = await Contact.create({ name, email, subject, message });
      res.status(201).json({ success: true, message: "Contact message saved to database.", data: newContact });
    } catch (err: any) {
      console.error("Error saving contact message:", err);
      res.status(500).json({ error: "Failed to save message to database." });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json({ success: true, count: contacts.length, data: contacts });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to retrieve contacts." });
    }
  });

  // AI Twin Chat API using Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          reply:
            "I am Tanmoy's AI Twin! (Note: GEMINI_API_KEY is not set yet in environment secrets, but feel free to ask me anything about Tanmoy's projects, tech stack, or freelance availability!).",
          fallback: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are Tanmoy's AI Twin & Portfolio Assistant representing Tanmoy Pal, a passionate Full-Stack Developer & UI/UX Specialist.
Key Info about Tanmoy Pal:
- Role: Full-Stack Developer (MERN Stack, React, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, Next.js).
- Contact Email: tanmoypal30102004@gmail.com
- Availability: Open for full-time Software Engineer positions, Internships, and Freelance projects.
- Key Projects:
  1. E-Commerce Master (Full MERN, Stripe Payments, JWT, Admin Dashboard)
  2. AI Content Studio (Gemini AI text & image generation, markdown exporter)
  3. DevConnect Hub (Developer network, tech feeds, GitHub integration)
  4. TaskPulse - Smart Kanban (Drag-and-drop, priority matrix, offline sync)
  5. CloudWeather Pro (Real-time weather, 7-day forecast, geo-location)
- Personality: Friendly, technical yet articulate, concise, professional, and enthusiastic about clean code and sleek UX design.
Keep answers helpful, direct, and under 150 words unless detailed project architecture is asked.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemInstruction}\n\nVisitor question: ${message}` },
            ],
          },
        ],
      });

      const reply =
        response.text ||
        "Thank you for reaching out! I'm happy to tell you more about Tanmoy's work.";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini Chat API Error:", err);
      res.status(500).json({
        reply:
          "Hi there! I encountered a temporary issue connecting to the AI model, but Tanmoy is available for new opportunities! Feel free to drop a line at tanmoypal30102004@gmail.com.",
        error: err.message,
      });
    }
  });

  // Vite middleware for development vs static build for production
  const serveVite = process.env.SERVE_VITE !== "false" && process.env.STANDALONE !== "true";
  if (process.env.NODE_ENV !== "production" && serveVite) {
    const disableHmr = process.env.DISABLE_HMR === "true";
    const baseHmrPort = Number(process.env.HMR_PORT || 24678);
    const hmrPort = await findAvailablePort(baseHmrPort, hostsToCheck);
    process.env.HMR_PORT = String(hmrPort);
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: disableHmr ? false : { port: hmrPort },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
