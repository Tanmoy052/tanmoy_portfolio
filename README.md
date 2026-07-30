# 🚀 Tanmoy Pal — Full-Stack Developer Portfolio & AI Assistant

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Connected-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.6_Flash-8E75FF?logo=google&logoColor=white)](https://ai.google.dev/)

A modern, high-performance, and feature-packed Developer Portfolio application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Motion**, **Express.js**, **MongoDB Atlas**, and an interactive **Gemini AI Twin Assistant**.

---

## ✨ Key Features

- 🤖 **Interactive AI Twin Chatbot**: Powered by Google Gemini 3.6 Flash. Visitors can chat with Tanmoy's AI persona to learn about projects, tech stack, experience, and availability in real time.
- 🗄️ **MongoDB Atlas Integration**: Direct database connection via Mongoose to record and manage contact form submissions, system health logs, and interactive queries in the `tanmoy_portfolio` database.
- 📬 **Dual Contact Pipeline**: Direct email notification via Web3Forms API combined with persistent storage in MongoDBAtlas.
- 🎨 **Modern Futuristic UI**: Dark/Light mode theme switching, glassmorphism, responsive grid layouts, and micro-interactions powered by `motion`.
- ⚡ **Full-Stack Concurrency**: Runs backend API (`Express`) and frontend SPA (`Vite`) concurrently in a single development command (`npm run dev`).
- 🛠️ **Interactive Resume & Project Showcase**: Dynamic filtering for featured full-stack projects, experience timeline, skills metrics, and interactive PDF/modal resume viewing.

---

## 🛠️ Tech Stack & Technologies

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & UI** | Tailwind CSS v4, Motion (`framer-motion` v12), Lucide React Icons |
| **Backend & Server** | Node.js, Express.js, `tsx` (TypeScript Execution) |
| **Database** | MongoDB Atlas, Mongoose ORM |
| **AI & APIs** | `@google/genai` (Gemini 3.6 Flash Model), Web3Forms API |
| **Development** | Concurrently, Nodemon, Cross-Env, Esbuild |

---

## 📁 Project Structure

```text
tanmoy-pal---developer-portfolio/
├── ├── .env                         # Local environment configuration (git-ignored)
├── ├── .env.example                 # Example environment template
├── ├── server.ts                    # Express backend server (API & Vite SSR/Middleware)
├── ├── vite.config.ts               # Vite bundler & API proxy configuration
├── ├── package.json                # Project dependencies & scripts
├── ├── tsconfig.json                # TypeScript compiler config
└── src/
    ├── main.tsx                     # React application entry point
    ├── App.tsx                      # Main App layout & section router
    ├── index.css                    # Tailwind CSS directives & global styling
    ├── components/                  # UI Components
    │   ├── Navbar.tsx               # Navigation header & theme switcher
    │   ├── HeroSection.tsx          # Hero banner & action buttons
    │   ├── AboutSection.tsx         # Bio, background & metrics
    │   ├── SkillsSection.tsx        # Technical skills & proficiency bars
    │   ├── ProjectsSection.tsx      # Projects grid with category filters
    │   ├── ExperienceTimeline.tsx   # Work experience & education timeline
    │   ├── ContactSection.tsx       # Direct message form & contact details
    │   ├── AITwinModal.tsx          # Floating Gemini AI Twin chat window
    │   ├── ResumeModal.tsx          # Interactive resume preview modal
    │   └── Footer.tsx               # Footer with social links & copyright
    └── data/
        └── portfolioData.ts         # Portfolio content, projects & skills data
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection URI
- A [Google Gemini API Key](https://aistudio.google.com/) (Optional, for AI Twin chat)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Tanmoy052/tanmoy-pal---developer-portfolio.git
   cd tanmoy-pal---developer-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Fill in your configuration details:
   ```env
   # Required for Gemini AI Twin Chat Assistant
   GEMINI_API_KEY="your_gemini_api_key_here"

   # MongoDB Atlas Connection String
   MONGODB_URI="mongodb://username:password@cluster.mongodb.net:27017/tanmoy_portfolio?ssl=true&replicaSet=atlas-shard-0&authSource=admin"

   # Backend Server Port
   PORT=5000

   # Client App URL
   APP_URL="http://localhost:3000"

   # Web3Forms Access Key for contact email delivery
   VITE_WEB3FORMS_ACCESS_KEY="your_web3forms_access_key"
   ```

---

## 🏃 Running the Application

To launch both the **Express backend server** (port 5000) and the **Vite frontend dev server** (port 3000) concurrently, run:

```bash
npm run dev
```

Open your browser and navigate to:
- **Frontend SPA**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 API Reference

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check backend server & MongoDB connection status | None |
| `POST` | `/api/chat` | Send visitor question to Gemini AI Twin assistant | `{ "message": "What are Tanmoy's top projects?" }` |
| `POST` | `/api/contact` | Save a contact form message directly to MongoDB | `{ "name": "Alice", "email": "alice@example.com", "subject": "Job Offer", "message": "Hi Tanmoy!" }` |
| `GET` | `/api/contacts` | Retrieve all stored contact messages from MongoDB | None |

---

## 📦 Building for Production

To create an optimized production build of the frontend and bundle the backend server:

```bash
npm run build
```

To start the production server:
```bash
npm run start
```

---

## 👨‍💻 Author

**Tanmoy Pal**  
- **Email**: [tanmoypal30102004@gmail.com](mailto:tanmoypal30102004@gmail.com)
- **GitHub**: [@Tanmoy052](https://github.com/Tanmoy052)
- **LinkedIn**: [Tanmoy Pal](https://linkedin.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to adapt and use it for your own portfolio!
