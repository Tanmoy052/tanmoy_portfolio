const fs = require('fs');
const path = require('path');

function createTanmoyResumePdf() {
  const content = [
    "BT",
    "/F1 22 Tf",
    "50 780 Td",
    "(TANMOY PAL) Tj",
    "/F2 12 Tf",
    "0 -22 Td",
    "(Full-Stack Developer & UI/UX Craftsman | MERN Stack Specialist) Tj",
    "/F2 10 Tf",
    "0 -16 Td",
    "(Email: tanmoypal30102004@gmail.com  |  Location: West Bengal, India  |  Portfolio: Live) Tj",
    "0 -14 Td",
    "(GitHub: github.com/Tanmoy052  |  LinkedIn: linkedin.com/in/tanmoy-pal) Tj",
    
    // Divider Line
    "ET",
    "0.2 0.7 0.5 RG",
    "2 w",
    "50 715 m 562 715 l S",
    "BT",

    // Professional Summary Section
    "/F1 13 Tf",
    "0 0 0 rg",
    "50 690 Td",
    "(PROFESSIONAL SUMMARY) Tj",
    "/F2 10 Tf",
    "0 -16 Td",
    "(Passionate Full-Stack Developer with expertise in React, TypeScript, Node.js, Express, and MongoDB.) Tj",
    "0 -14 Td",
    "(Proven ability to design, develop, and deploy high-performance web applications with modern UI/UX,) Tj",
    "0 -14 Td",
    "(stateful RESTful APIs, robust database architecture, and seamless interactive experiences.) Tj",

    // Skills Section
    "/F1 13 Tf",
    "0 -26 Td",
    "(TECHNICAL PROFICIENCIES) Tj",
    "/F2 10 Tf",
    "0 -16 Td",
    "(Frontend: React 19, TypeScript, Next.js, Tailwind CSS, HTML5, CSS3, JavaScript, Framer Motion) Tj",
    "0 -14 Td",
    "(Backend: Node.js, Express.js, REST APIs, Multer, JWT Authentication, WebSockets) Tj",
    "0 -14 Td",
    "(Database: MongoDB Atlas, Mongoose ODM, Relational DB Foundations) Tj",
    "0 -14 Td",
    "(DevOps & Tools: Git, GitHub, Vite, Postman, npm, Docker basics, Linux / PowerShell) Tj",

    // Featured Projects
    "/F1 13 Tf",
    "0 -26 Td",
    "(FEATURED PROJECTS) Tj",
    "/F1 11 Tf",
    "0 -16 Td",
    "(1. CGEC Official College Website (Full-Stack Portal)) Tj",
    "/F2 10 Tf",
    "0 -14 Td",
    "(- Built responsive institutional portal with departmental notice boards and faculty directory.) Tj",
    "0 -14 Td",
    "(- Tech Stack: React, Node.js, Express, MongoDB, Tailwind CSS) Tj",

    "/F1 11 Tf",
    "0 -18 Td",
    "(2. Interactive Admin Control Console & Content Manager) Tj",
    "/F2 10 Tf",
    "0 -14 Td",
    "(- Built glassmorphic real-time content management dashboard with MongoDB Atlas sync.) Tj",
    "0 -14 Td",
    "(- Features PDF resume hot-swap, inquiry manager with CSV export, and security controls.) Tj",

    "/F1 11 Tf",
    "0 -18 Td",
    "(3. AI Assistant & Portfolio Ecosystem) Tj",
    "/F2 10 Tf",
    "0 -14 Td",
    "(- Real-time developer showcase with Gemini AI chat, live project filters, and custom animations.) Tj",

    // Education
    "/F1 13 Tf",
    "0 -26 Td",
    "(EDUCATION) Tj",
    "/F1 11 Tf",
    "0 -16 Td",
    "(B.Tech in Computer Science & Engineering) Tj",
    "/F2 10 Tf",
    "0 -14 Td",
    "(Cooch Behar Government Engineering College (CGEC) | 2022 - 2026) Tj",
    "0 -14 Td",
    "(Focus: Data Structures, Algorithms, Database Management Systems, Computer Networks) Tj",

    "ET"
  ].join("\n");

  const streamBytes = Buffer.from(content, "utf-8");
  const streamLength = streamBytes.length;

  // Assemble PDF objects
  let objects = [];
  
  // Object 1: Catalog
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Object 2: Pages
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  // Object 3: Page
  objects.push("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n");

  // Object 4: Stream
  objects.push(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${content}\nendstream\nendobj\n`);

  // Object 5: Font F1 (Helvetica-Bold)
  objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");

  // Object 6: Font F2 (Helvetica)
  objects.push("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

  const header = "%PDF-1.4\n";
  let offset = header.length;
  let xref = "xref\n0 7\n0000000000 65535 f \n";

  let body = "";
  for (let i = 0; i < objects.length; i++) {
    const objOffset = offset.toString().padStart(10, "0");
    xref += `${objOffset} 00000 n \n`;
    body += objects[i];
    offset += Buffer.byteLength(objects[i], "utf-8");
  }

  const startxref = offset;
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  const finalPdf = header + body + xref + trailer;

  // Save to public/Tanmoy_Pal_Resume.pdf
  const publicPath = path.join(process.cwd(), "public", "Tanmoy_Pal_Resume.pdf");
  fs.writeFileSync(publicPath, finalPdf, "binary");
  console.log("Saved valid PDF to:", publicPath, `(${fs.statSync(publicPath).size} bytes)`);

  // Save to dist/Tanmoy_Pal_Resume.pdf if dist exists
  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, "Tanmoy_Pal_Resume.pdf");
    fs.writeFileSync(distPath, finalPdf, "binary");
    console.log("Synced valid PDF to:", distPath, `(${fs.statSync(distPath).size} bytes)`);
  }
}

createTanmoyResumePdf();
