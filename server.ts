import express from "express";
import net from "net";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, TIMELINE } from "./src/data/portfolioData";

dotenv.config();

// Ensure public upload directories exist
const publicDir = path.join(process.cwd(), "public");
const projectsUploadDir = path.join(publicDir, "projects");
if (!fs.existsSync(projectsUploadDir)) {
  fs.mkdirSync(projectsUploadDir, { recursive: true });
}
const documentsUploadDir = path.join(publicDir, "documents");
if (!fs.existsSync(documentsUploadDir)) {
  fs.mkdirSync(documentsUploadDir, { recursive: true });
}

// Multer storage for Resume PDF
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicDir);
  },
  filename: (req, file, cb) => {
    cb(null, "Tanmoy_Pal_Resume.pdf");
  },
});
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for resume upload."));
    }
  },
});

// Multer storage for Personal Documents (PDF only)
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `doc_${base}_${Date.now()}${ext}`);
  },
});
const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for document upload."));
    }
  },
});

// Multer storage for project & portfolio images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectsUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Mongoose Contact Schema & Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Contact: mongoose.Model<any> = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

// Mongoose Portfolio Schema & Model for dynamic editable content
const portfolioSchema = new mongoose.Schema({
  key: { type: String, default: "main", unique: true },
  about: { type: mongoose.Schema.Types.Mixed, default: () => ({ ...PERSONAL_INFO }) },
  resume: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      pdfUrl: "/Tanmoy_Pal_Resume.pdf",
      headline: "Full-Stack Developer & UI/UX Craftsman",
      lastUpdated: new Date().toISOString().split("T")[0],
    }),
  },
  skills: { type: [mongoose.Schema.Types.Mixed], default: () => [...SKILL_CATEGORIES] },
  projects: { type: [mongoose.Schema.Types.Mixed], default: () => [...PROJECTS] },
  experiences: { type: [mongoose.Schema.Types.Mixed], default: () => [...TIMELINE] },
  updatedAt: { type: Date, default: Date.now },
});
const Portfolio: mongoose.Model<any> = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);

// Mongoose Admin Account Schema & Model for persistent credentials
const adminAccountSchema = new mongoose.Schema({
  key: { type: String, default: "primary", unique: true },
  username: { type: String, required: true, default: "tanmoypal30102004" },
  email: { type: String, default: "tanmoypal30102004@gmail.com" },
  password: { type: String, required: true, default: "tanmoy12345" },
  updatedAt: { type: Date, default: Date.now },
});
const AdminAccount: mongoose.Model<any> = mongoose.models.AdminAccount || mongoose.model("AdminAccount", adminAccountSchema);

// Mongoose Personal Document Schema & Model for PDF Documents (Database-Backed Persistent Storage)
const personalDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "General" },
  description: { type: String, default: "" },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  fileData: { type: Buffer, select: false }, // Binary PDF buffer stored directly in MongoDB Atlas
  fileType: { type: String, default: "application/pdf" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const PersonalDocument: mongoose.Model<any> = mongoose.models.PersonalDocument || mongoose.model("PersonalDocument", personalDocumentSchema);

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

    // Seed Contact document if empty
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.create({
        name: "System Welcome",
        email: "tanmoypal30102004@gmail.com",
        subject: "Portfolio Database Initialized",
        message: "Welcome to Tanmoy Pal's developer portfolio database! Mongoose is successfully connected.",
      });
      console.log("Created initial document in 'contacts' collection.");
    }

    // Seed Portfolio document if not exists
    const existingPortfolio = await Portfolio.findOne({ key: "main" });
    if (!existingPortfolio) {
      await Portfolio.create({
        key: "main",
        about: PERSONAL_INFO,
        resume: {
          pdfUrl: "/Tanmoy_Pal_Resume.pdf",
          headline: "Full-Stack Developer & UI/UX Craftsman",
          lastUpdated: new Date().toISOString().split("T")[0],
        },
        skills: SKILL_CATEGORIES,
        projects: PROJECTS,
        experiences: TIMELINE,
      });
      console.log("Seeded initial portfolio data into MongoDB.");
    }

    // Seed Admin Account document if not exists
    const existingAdmin = await AdminAccount.findOne({ key: "primary" });
    if (!existingAdmin) {
      await AdminAccount.create({
        key: "primary",
        username: process.env.ADMIN_USERNAME || "tanmoypal30102004",
        email: process.env.ADMIN_EMAIL || "tanmoypal30102004@gmail.com",
        password: process.env.ADMIN_PASSWORD || "tanmoy12345",
      });
      console.log("Seeded initial Admin Account into MongoDB.");
    } else if (!existingAdmin.email) {
      existingAdmin.email = process.env.ADMIN_EMAIL || "tanmoypal30102004@gmail.com";
      await existingAdmin.save();
    }

    // Seed initial personal document if not exists
    const docCount = await PersonalDocument.countDocuments();
    if (docCount === 0) {
      await PersonalDocument.create({
        title: "Tanmoy Pal - Professional Resume & Technical Credentials",
        category: "Certifications & Resume",
        description: "Official verified developer resume, skillset index, and contact credentials in high-resolution PDF format.",
        fileName: "Tanmoy_Pal_Resume.pdf",
        originalName: "Tanmoy_Pal_Resume.pdf",
        fileUrl: "/Tanmoy_Pal_Resume.pdf",
        fileSize: 278421,
      });
      console.log("Seeded initial document into 'personaldocuments' collection.");
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
  const hostsToCheck = HOST === "0.0.0.0" ? [HOST, "::"] : [HOST];

  let PORT = basePort;
  if (process.env.NODE_ENV !== "production" && !process.env.PORT) {
    PORT = await findAvailablePort(basePort, hostsToCheck);
  }

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Static uploads serving
  app.use("/public", express.static(publicDir));
  app.use("/projects", express.static(projectsUploadDir));
  app.use("/documents", express.static(documentsUploadDir));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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

  // Admin Login Endpoint (Verifies against MongoDB AdminAccount by Username or Email)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const adminRecord = await AdminAccount.findOne({ key: "primary" });
      const expectedUser = adminRecord?.username || process.env.ADMIN_USERNAME || "tanmoypal30102004";
      const expectedPass = adminRecord?.password || process.env.ADMIN_PASSWORD || "tanmoy12345";
      const expectedEmail = adminRecord?.email || process.env.ADMIN_EMAIL || "tanmoypal30102004@gmail.com";

      const cleanIdentifier = String(username || "").trim().toLowerCase();
      const isIdentifierMatch =
        !username ||
        cleanIdentifier === expectedUser.toLowerCase() ||
        cleanIdentifier === expectedEmail.toLowerCase();

      if (password === expectedPass && isIdentifierMatch) {
        return res.json({
          success: true,
          token: "admin-session-" + Date.now(),
          user: expectedUser,
          username: expectedUser,
          email: expectedEmail,
        });
      }
      return res.status(401).json({ error: "Invalid username/email or password. Please verify your credentials." });
    } catch (err: any) {
      console.error("Login verification error:", err);
      res.status(500).json({ error: "Login failed due to an internal server error." });
    }
  });

  // GET Current Admin Profile (Username & Email, never password)
  app.get("/api/admin/user", async (req, res) => {
    try {
      const adminRecord = await AdminAccount.findOne({ key: "primary" });
      const currentUsername = adminRecord?.username || process.env.ADMIN_USERNAME || "tanmoypal30102004";
      const currentEmail = adminRecord?.email || process.env.ADMIN_EMAIL || "tanmoypal30102004@gmail.com";
      res.json({
        success: true,
        username: currentUsername,
        email: currentEmail,
        updatedAt: adminRecord?.updatedAt || new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to retrieve user profile." });
    }
  });

  // PUT Update Admin Credentials (Username, Email, and/or Password)
  app.put("/api/admin/user", async (req, res) => {
    try {
      const { currentPassword, newUsername, newEmail, newPassword } = req.body;
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to authorize account changes." });
      }

      const adminRecord = await AdminAccount.findOne({ key: "primary" });
      const activePassword = adminRecord?.password || process.env.ADMIN_PASSWORD || "tanmoy12345";

      if (currentPassword !== activePassword) {
        return res.status(401).json({ error: "Current password does not match. Please verify and try again." });
      }

      if ((!newUsername || !newUsername.trim()) && (!newEmail || !newEmail.trim()) && (!newPassword || !newPassword.trim())) {
        return res.status(400).json({ error: "Please enter a new username, email, or password to update." });
      }

      const updateFields: any = { updatedAt: new Date() };

      if (newUsername && newUsername.trim()) {
        const cleanUser = newUsername.trim();
        if (cleanUser.length < 3) {
          return res.status(400).json({ error: "Username must be at least 3 characters long." });
        }
        updateFields.username = cleanUser;
      }

      if (newEmail && newEmail.trim()) {
        const cleanEmail = newEmail.trim().toLowerCase();
        if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
          return res.status(400).json({ error: "Please provide a valid email address." });
        }
        updateFields.email = cleanEmail;
      }

      if (newPassword && newPassword.trim()) {
        const cleanPass = newPassword.trim();
        if (cleanPass.length < 6) {
          return res.status(400).json({ error: "New password must be at least 6 characters long." });
        }
        updateFields.password = cleanPass;
      }

      const updated = await AdminAccount.findOneAndUpdate(
        { key: "primary" },
        { $set: updateFields },
        { returnDocument: 'after', upsert: true }
      );

      res.json({
        success: true,
        message: "Admin credentials successfully updated in MongoDB Atlas. Documents vault access updated as well.",
        username: updated.username,
        email: updated.email,
        updatedAt: updated.updatedAt,
      });
    } catch (err: any) {
      console.error("Error updating admin user:", err);
      res.status(500).json({ error: "Failed to update admin credentials." });
    }
  });

  // ==========================================
  // PERSONAL DOCUMENTS VAULT API ENDPOINTS
  // ==========================================

  // 1. Documents Auth Verification (uses Admin Account credentials)
  app.post("/api/documents/auth", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ error: "Email/username and password are required." });
      }

      const adminRecord = await AdminAccount.findOne({ key: "primary" });
      const expectedUser = adminRecord?.username || process.env.ADMIN_USERNAME || "tanmoypal30102004";
      const expectedPass = adminRecord?.password || process.env.ADMIN_PASSWORD || "tanmoy12345";
      const expectedEmail = adminRecord?.email || process.env.ADMIN_EMAIL || "tanmoypal30102004@gmail.com";

      const cleanId = String(identifier).trim().toLowerCase();
      const isIdentifierMatch = cleanId === expectedUser.toLowerCase() || cleanId === expectedEmail.toLowerCase();
      const isPasswordMatch = password === expectedPass;

      if (isIdentifierMatch && isPasswordMatch) {
        return res.json({
          success: true,
          token: "doc-vault-" + Date.now(),
          user: expectedUser,
          email: expectedEmail,
          message: "Documents Vault unlocked successfully.",
        });
      }

      return res.status(401).json({
        error: "Invalid credentials. Please enter your valid admin email/username and password to access documents.",
      });
    } catch (err: any) {
      console.error("Documents verification error:", err);
      res.status(500).json({ error: "Verification failed due to an internal server error." });
    }
  });

  // 2. GET All Personal Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const docs = await PersonalDocument.find().sort({ createdAt: -1 });
      res.json({ success: true, data: docs });
    } catch (err: any) {
      console.error("Failed to fetch documents:", err);
      res.status(500).json({ error: "Failed to retrieve documents." });
    }
  });

  // 3. POST Upload New Document (PDF)
  app.post("/api/admin/documents", (req, res) => {
    uploadDocument.single("file")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message || "Only PDF files are supported for document upload." });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: "No PDF file uploaded. Only PDF files are supported." });
        }

        const { title, category, description } = req.body;
        if (!title || !title.trim()) {
          return res.status(400).json({ error: "Document title is required." });
        }

        const fileUrl = `/documents/${req.file.filename}`;

        // Read uploaded file buffer for persistent cloud storage in MongoDB Atlas
        let fileBuffer: Buffer | undefined;
        try {
          fileBuffer = await fs.promises.readFile(req.file.path);
        } catch (readErr) {
          console.warn("Could not read uploaded file to buffer:", readErr);
        }

        // Asynchronously sync to dist/documents in background if dist directory exists
        const distDocumentsDir = path.join(process.cwd(), "dist", "documents");
        if (fs.existsSync(path.join(process.cwd(), "dist"))) {
          if (!fs.existsSync(distDocumentsDir)) {
            fs.mkdirSync(distDocumentsDir, { recursive: true });
          }
          fs.promises.copyFile(req.file.path, path.join(distDocumentsDir, req.file.filename)).catch((e) => {
            console.warn("Could not copy document to dist/documents:", e);
          });
        }

        const newDoc = await PersonalDocument.create({
          title: title.trim(),
          category: category?.trim() || "General",
          description: description?.trim() || "",
          fileName: req.file.filename,
          originalName: req.file.originalname,
          fileUrl,
          fileSize: req.file.size || fileBuffer?.length || 0,
          fileData: fileBuffer,
          fileType: req.file.mimetype || "application/pdf",
        });

        res.status(201).json({
          success: true,
          message: "Document successfully added to personal vault.",
          data: newDoc,
        });
      } catch (uploadErr: any) {
        console.error("Document upload error:", uploadErr);
        res.status(500).json({ error: uploadErr.message || "Failed to upload document." });
      }
    });
  });

  // 4. DELETE Personal Document (High-Performance Single-Query Deletion)
  app.delete("/api/admin/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid document ID." });
      }

      // Atomic single-query find and delete from MongoDB Atlas
      const doc = await PersonalDocument.findByIdAndDelete(id);
      if (!doc) {
        return res.status(404).json({ error: "Document not found in vault." });
      }

      // Asynchronously delete physical files without stalling the HTTP response
      const safeFileName = path.basename(doc.fileName);
      const filePath = path.join(documentsUploadDir, safeFileName);
      const distFilePath = path.join(process.cwd(), "dist", "documents", safeFileName);

      Promise.allSettled([
        fs.promises.unlink(filePath).catch(() => {}),
        fs.promises.unlink(distFilePath).catch(() => {})
      ]).catch(() => {});

      res.json({ success: true, message: "Document removed from vault successfully." });
    } catch (err: any) {
      console.error("Error deleting document:", err);
      res.status(500).json({ error: "Failed to delete document." });
    }
  });

  // 5. GET Download Personal Document (Hybrid Disk + Database-Backed Stream)
  app.get("/api/documents/download/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid document ID." });
      }

      // Fetch document including binary buffer
      const doc = await PersonalDocument.findById(id).select("+fileData");
      if (!doc) {
        return res.status(404).json({ error: "Document not found in vault." });
      }

      const safeDownloadName = (doc.originalName || `${doc.title}.pdf`).replace(/[^a-zA-Z0-9_.-]/g, "_");
      const safeFileName = path.basename(doc.fileName);
      let filePath = path.join(documentsUploadDir, safeFileName);

      // Strategy 1: Fast local disk stream if physical file exists
      if (fs.existsSync(filePath)) {
        return res.download(filePath, safeDownloadName);
      }
      const altPath = path.join(publicDir, safeFileName);
      if (fs.existsSync(altPath)) {
        return res.download(altPath, safeDownloadName);
      }

      // Strategy 2: Stream directly from MongoDB Atlas binary buffer (cross-device & cloud deployments)
      if (doc.fileData && doc.fileData.length > 0) {
        // Self-heal disk cache in background
        fs.promises.writeFile(filePath, doc.fileData).catch(() => {});
        res.setHeader("Content-Type", doc.fileType || "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${safeDownloadName}"`);
        res.setHeader("Content-Length", doc.fileData.length);
        return res.end(doc.fileData);
      }

      return res.status(404).json({ error: "Document file content not found on server or database." });
    } catch (err: any) {
      console.error("Document download error:", err);
      res.status(500).json({ error: "Failed to download document." });
    }
  });

  // 6. GET View / Preview Personal Document (Inline PDF Stream)
  app.get("/api/documents/view/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid document ID." });
      }

      const doc = await PersonalDocument.findById(id).select("+fileData");
      if (!doc) {
        return res.status(404).json({ error: "Document not found." });
      }

      const safeFileName = path.basename(doc.fileName);
      let filePath = path.join(documentsUploadDir, safeFileName);
      if (!fs.existsSync(filePath)) {
        const altPath = path.join(publicDir, safeFileName);
        if (fs.existsSync(altPath)) filePath = altPath;
      }

      if (fs.existsSync(filePath)) {
        res.setHeader("Content-Type", doc.fileType || "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
        return fs.createReadStream(filePath).pipe(res);
      }

      if (doc.fileData && doc.fileData.length > 0) {
        fs.promises.writeFile(filePath, doc.fileData).catch(() => {});
        res.setHeader("Content-Type", doc.fileType || "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
        res.setHeader("Content-Length", doc.fileData.length);
        return res.end(doc.fileData);
      }

      return res.status(404).json({ error: "Document content unavailable." });
    } catch (err: any) {
      console.error("Document view error:", err);
      res.status(500).json({ error: "Failed to view document." });
    }
  });

  // Fallback for direct /documents/:fileName route
  app.get("/documents/:fileName", async (req, res, next) => {
    const safeFileName = path.basename(req.params.fileName);
    const filePath = path.join(documentsUploadDir, safeFileName);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    const altPath = path.join(publicDir, safeFileName);
    if (fs.existsSync(altPath)) {
      return res.sendFile(altPath);
    }

    try {
      const doc = await PersonalDocument.findOne({ fileName: safeFileName }).select("+fileData");
      if (doc && doc.fileData && doc.fileData.length > 0) {
        fs.promises.writeFile(filePath, doc.fileData).catch(() => {});
        res.setHeader("Content-Type", doc.fileType || "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
        return res.end(doc.fileData);
      }
    } catch (e) {}

    res.status(404).json({ error: "File not found on server or database." });
  });

  // GET Dynamic Portfolio Content
  app.get("/api/portfolio", async (req, res) => {
    try {
      let data = await Portfolio.findOne({ key: "main" });
      if (!data) {
        data = await Portfolio.create({
          key: "main",
          about: PERSONAL_INFO,
          resume: {
            pdfUrl: "/Tanmoy_Pal_Resume.pdf",
            headline: "Full-Stack Developer & UI/UX Craftsman",
            lastUpdated: new Date().toISOString().split("T")[0],
          },
          skills: SKILL_CATEGORIES,
          projects: PROJECTS,
          experiences: TIMELINE,
        });
      }
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("Error fetching portfolio:", err);
      res.json({
        success: true,
        data: {
          about: PERSONAL_INFO,
          resume: { pdfUrl: "/Tanmoy_Pal_Resume.pdf" },
          skills: SKILL_CATEGORIES,
          projects: PROJECTS,
          experiences: TIMELINE,
        },
      });
    }
  });

  // PUT Update Dynamic Portfolio Content (Admin)
  app.put("/api/admin/portfolio", async (req, res) => {
    try {
      const { about, resume, skills, projects, experiences } = req.body;
      const updatePayload: any = { updatedAt: new Date() };
      if (about !== undefined) updatePayload.about = about;
      if (resume !== undefined) updatePayload.resume = resume;
      if (skills !== undefined) updatePayload.skills = skills;
      if (projects !== undefined) updatePayload.projects = projects;
      if (experiences !== undefined) updatePayload.experiences = experiences;

      const updated = await Portfolio.findOneAndUpdate(
        { key: "main" },
        { $set: updatePayload },
        { returnDocument: 'after', upsert: true }
      );
      res.json({ success: true, message: "Portfolio successfully updated in database.", data: updated });
    } catch (err: any) {
      console.error("Error updating portfolio:", err);
      res.status(500).json({ error: "Failed to update portfolio data." });
    }
  });

  // POST Upload Updated Resume PDF
  app.post("/api/admin/resume", uploadResume.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded." });
      }

      // Sync to dist folder if it exists
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        try {
          fs.copyFileSync(req.file.path, path.join(distDir, "Tanmoy_Pal_Resume.pdf"));
        } catch (copyErr) {
          console.warn("Could not sync PDF to dist directory:", copyErr);
        }
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const resumeUrl = `/Tanmoy_Pal_Resume.pdf?v=${Date.now()}`;

      await Portfolio.findOneAndUpdate(
        { key: "main" },
        {
          $set: {
            "resume.pdfUrl": resumeUrl,
            "resume.lastUpdated": timestamp,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      res.json({
        success: true,
        message: "Resume PDF uploaded successfully and live across the portfolio.",
        pdfUrl: resumeUrl,
        lastUpdated: timestamp,
      });
    } catch (err: any) {
      console.error("Resume upload error:", err);
      res.status(500).json({ error: err.message || "Failed to upload resume PDF." });
    }
  });

  // POST Upload Project/General Image
  app.post("/api/admin/upload-image", uploadImage.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded." });
      }

      const imageUrl = `/projects/${req.file.filename}`;

      // Sync to dist/projects if dist exists
      const distProjectsDir = path.join(process.cwd(), "dist", "projects");
      if (fs.existsSync(path.join(process.cwd(), "dist"))) {
        if (!fs.existsSync(distProjectsDir)) fs.mkdirSync(distProjectsDir, { recursive: true });
        try {
          fs.copyFileSync(req.file.path, path.join(distProjectsDir, req.file.filename));
        } catch (e) {}
      }

      res.json({ success: true, url: imageUrl });
    } catch (err: any) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Failed to upload image." });
    }
  });

  // Contact API Endpoints
  const handleContactPost = async (req: any, res: any) => {
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
  };

  app.post("/api/contact", handleContactPost);
  app.post("/api/contacts", handleContactPost);

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json({ success: true, count: contacts.length, data: contacts });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to retrieve contacts." });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Contact.deleteOne({ _id: id });
      res.json({ success: true, message: "Contact inquiry deleted." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete contact inquiry." });
    }
  });

  // AI Twin Chat API using Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
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
- Personality: Friendly, technical yet articulate, concise, professional, and enthusiastic about clean code and sleek UX design.
Keep answers helpful, direct, and under 150 words unless detailed project architecture is asked.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nVisitor question: ${message}` }],
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
