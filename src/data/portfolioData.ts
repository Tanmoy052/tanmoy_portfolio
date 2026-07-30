import { Project, SkillCategory, TimelineItem, AuditPoint } from '../types';

export const PERSONAL_INFO = {
  name: 'Tanmoy Pal',
  tagline: 'Full-Stack Developer & UI/UX Craftsman',
  avatar: '/tanmoy_pal.png',
  subTagline: 'Specializing in MERN Stack, TypeScript, React 19, Node.js, and AI Integrations.',
  bio: 'Passionate developer dedicated to building high-performance, accessible, and visually stunning web applications. Experienced in architecting responsive frontends, scalable RESTful APIs, real-time databases, and seamless user experiences.',
  email: 'tanmoypal30102004@gmail.com',
  phone: '+91 9109241104',
  github: 'https://github.com/Tanmoy052/',
  linkedin: 'https://www.linkedin.com/in/tanmoy-pal-755611294/',
  twitter: 'https://twitter.com/tanmoypal_dev',
  location: 'Kolkata, India',
  status: 'Open for Opportunities & Freelance Projects',
  stats: [
    { label: 'Projects Completed', value: '10+' },
    { label: 'Cups of Coffee', value: '1000+' },
    { label: 'LeetCode DSA Solved', value: '100+' },
    { label: 'Years Experience', value: '2+' },
  ]
};

export const PROJECTS: Project[] = [
  {
    id: 'fossils-music-stream',
    title: 'Fossils-Music-Stream',
    shortDescription: 'A specialized music streaming platform dedicated to the legendary Bengali Rock band Fossils, featuring their entire discography from 2002 to 2026.',
    fullDescription: 'A full-featured music streaming web app dedicated to the legendary Bengali Rock band Fossils. Features album categorization, lyrics synchronization, playlist creation, and high-quality audio playback.',
    category: 'Full Stack',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
    featured: true,
    image: '/projects/fossils_music_stream.png',
    demoUrl: 'https://fossils-music-stream.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/Fossils-Music-stream',
    starsCount: 42,
    metrics: [
      { label: 'Discography', value: '2002 - 2026' },
      { label: 'Audio Latency', value: '< 50ms' },
      { label: 'Platform', value: 'Web & Mobile' }
    ],
    features: [
      'Full discography stream from Fossils 1 (2002) to Fossils 7',
      'Synchronized lyrics viewer with dark rock aesthetic',
      'Custom playlist builder & queue manager',
      'Responsive audio player with volume & seek control'
    ],
    architecture: [
      'Frontend: Next.js + React + Tailwind CSS',
      'Deployment: Vercel Edge Serverless'
    ]
  },
  {
    id: 'cgec-student-portal',
    title: 'CGEC Student Portal',
    shortDescription: 'A comprehensive student management system for Cooch Behar Government Engineering College, featuring attendance tracking, project repositories, and academic records.',
    fullDescription: 'An all-in-one institutional portal for Cooch Behar Government Engineering College (CGEC). Allows students and faculty to manage attendance, submit project repositories, view exam results, and access official department notices.',
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    featured: true,
    image: '/projects/cgec_student_portal.png',
    demoUrl: 'https://cgec-sms-portal.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/sms2',
    starsCount: 35,
    metrics: [
      { label: 'College', value: 'CGEC' },
      { label: 'Active Users', value: '1200+' },
      { label: 'Security', value: 'Role Auth' }
    ],
    features: [
      'Attendance tracking and analytics dashboard for students & faculty',
      'Project repository submission system with file attachments',
      'Official departmental announcements and notice board',
      'Academic records viewer and GPA calculator'
    ],
    architecture: [
      'Client: React SPA + Tailwind CSS',
      'Server: Node.js + Express API',
      'Database: MongoDB Cloud Database'
    ]
  },
  {
    id: 'cgec-website',
    title: 'CGEC Website',
    shortDescription: 'A real-time chat platform using WebSockets with AI-powered responses and seamless communication.',
    fullDescription: 'The official Cooch Behar Government Engineering College website featuring department portals, admissions guidance, real-time campus chat support, and interactive virtual campus tours.',
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    featured: true,
    image: '/projects/cgec_website.png',
    demoUrl: 'https://cgec-website-frontend.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/CGEC-Website',
    starsCount: 29,
    metrics: [
      { label: 'Departments', value: '5+' },
      { label: 'Students Served', value: '1200+' },
      { label: 'Placement Rate', value: 'Top Rated' }
    ],
    features: [
      'Real-time WebSocket chat platform for student communication',
      'AI-powered responses for admissions and helpline queries',
      'Departmental syllabus and faculty directory',
      'Notice board & placement highlights'
    ],
    architecture: [
      'Client: React + Socket.io Client',
      'Server: Node.js / Express WebSocket Server',
      'Database: MongoDB Mongoose Schemas'
    ]
  },
  {
    id: 'sign-in-system',
    title: 'Sign In System',
    shortDescription: 'A secure sign-in system with user authentication and authorization features.',
    fullDescription: 'A modern production-ready authentication and authorization system supporting email/password sign-in, OTP verification, OAuth providers, JWT session tokens, and password reset flows.',
    category: 'Full Stack',
    tags: ['Next.js', 'Tailwind CSS', 'Redux', 'Prisma'],
    featured: false,
    image: '/projects/sign_in_system.png',
    demoUrl: 'https://signin-portal.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/sign_in_system',
    starsCount: 24,
    metrics: [
      { label: 'Security', value: 'OAuth 2.0 & JWT' },
      { label: 'ORM', value: 'Prisma' },
      { label: 'State', value: 'Redux Toolkit' }
    ],
    features: [
      'Secure user registration with email OTP verification',
      'JWT session management with HttpOnly cookie handling',
      'Role-based authorization middleware',
      'Dark mode authentication UI with animated transitions'
    ],
    architecture: [
      'Framework: Next.js App Router + Prisma ORM',
      'State: Redux Toolkit',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    shortDescription: 'A modern, high-performance portfolio website showcasing skills, projects, and a dynamic blog.',
    fullDescription: 'A sleek personal portfolio website designed to showcase projects, technical skills, interactive career timeline, terminal CLI easter egg, and contact forms with fluid animations.',
    category: 'Frontend',
    tags: ['Next.js', 'Tailwind CSS', 'React', 'Framer Motion'],
    featured: false,
    image: '/projects/portfolio_website.png',
    demoUrl: 'https://tanmoypal-portfolio.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/tanmoy_portfolio',
    starsCount: 31,
    metrics: [
      { label: 'Lighthouse Score', value: '100/100' },
      { label: 'Animations', value: '60 FPS' },
      { label: 'Responsive', value: '100%' }
    ],
    features: [
      'Interactive 3D card perspective tilt and smooth scroll tracking',
      'Theme customization with fluid dark/light transitions',
      'Project showcase with filterable technology tags',
      'Contact form integration & downloadable resume'
    ],
    architecture: [
      'Frontend: Next.js + React 19 + Framer Motion',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'gym-website',
    title: 'Gym Website',
    shortDescription: 'A modern, high-performance gym website showcasing fitness packages and equipment.',
    fullDescription: 'A sleek gym website designed to showcase fitness packages, equipment, and gym services.',
    category: 'Full Stack',
    tags: ['Next.js', 'Tailwind CSS', 'React', 'Framer Motion'],
    featured: true,
    image: '/projects/gym_website.png',
    demoUrl: 'https://github.com/Tanmoy052/jym_website',
    githubUrl: 'https://github.com/Tanmoy052/jym_website',
    starsCount: 31,
    metrics: [
      { label: 'Members', value: '100+' },
      { label: 'Plans', value: '10+' },
      { label: 'Responsive', value: '100%' }
    ],
    features: [
      'Interactive 3D card perspective tilt and smooth scroll tracking',
      'Theme customization with fluid dark/light transitions',
      'Project showcase with filterable technology tags',
      'Contact form integration & downloadable resume'
    ],
    architecture: [
      'Frontend: Next.js + React 19 + Framer Motion',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'digital-seva-kendra',
    title: 'Digital Seva Kendra',
    shortDescription: 'A full-stack cyber café platform featuring an admin dashboard, service management, and secure authentication for local digital services.',
    fullDescription: 'A comprehensive cyber café and digital services portal enabling citizens to request online services (PAN card, Aadhaar updates, digital certificates) with automated order status updates and admin management.',
    category: 'Full Stack',
    tags: ['Next.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    featured: false,
    image: '/projects/digital_seva_kendra.png',
    demoUrl: 'https://online-shop-pi-five.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/online-shop',
    starsCount: 20,
    metrics: [
      { label: 'Services Listed', value: '50+' },
      { label: 'Satisfied Customers', value: '1000+' },
      { label: 'Turnaround Time', value: 'Same Day' }
    ],
    features: [
      'Digital service request tracking system for local online services',
      'Admin dashboard for managing service status & customer orders',
      'WhatsApp integration & quick call buttons',
      'Secure user login & document management'
    ],
    architecture: [
      'Framework: Next.js + MongoDB Database',
      'Auth: JWT Authentication',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'inventory-management-system',
    title: 'Inventory Management System',
    shortDescription: 'A full-stack Inventory Management System for businesses to track products, manage stock levels, and monitor inventory with real-time updates.',
    fullDescription: 'A comprehensive inventory management system enabling businesses to track products, manage stock levels, and monitor inventory with real-time updates.',
    category: 'Full Stack',
    tags: ['Next.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    featured: false,
    image: '/projects/inventory_management_system.png',
    demoUrl: 'https://github.com/Tanmoy052/Inventory-Tracking-System',
    githubUrl: 'https://github.com/Tanmoy052/Inventory-Tracking-System',
    starsCount: 20,
    metrics: [
      { label: 'Items Tracked', value: '5000+' },
      { label: 'Satisfied Customers', value: '50+' },
      { label: 'Turnaround Time', value: 'Same Day' }
    ],
    features: [
      'Inventory tracking system for local businesses',
      'Admin dashboard for managing inventory & orders',
      'WhatsApp integration & quick call buttons',
      'Secure user login & document management'
    ],
    architecture: [
      'Framework: Next.js + MongoDB Database',
      'Auth: JWT Authentication',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'dress-shop',
    title: 'Dress Shop',
    shortDescription: 'A full-stack dress shop for businesses.',
    fullDescription: 'A simple and efficient dress shop for businesses. This shop enables businesses to track products, manage stock levels, and monitor inventory with real-time updates.',
    category: 'Full Stack',
    tags: ['Next.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    featured: false,
    image: '/projects/dress_shop.png',
    demoUrl: 'https://github.com/Tanmoy052/dress_shop',
    githubUrl: 'https://github.com/Tanmoy052/dress_shop',
    starsCount: 0,
    metrics: [
      { label: 'Items', value: '20+' },
    ],
    features: [
      'Product showcase for local businesses',
      'Admin dashboard for managing products & orders',
      'WhatsApp integration & quick call buttons',
    ],
    architecture: [
      'Framework: Next.js + MongoDB Database',
      'Auth: JWT Authentication',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'grocery-shop',
    title: 'Grocery Shop',
    shortDescription: 'A full-stack grocery shop for businesses.',
    fullDescription: 'A simple and efficient grocery shop for businesses. This shop enables businesses to track products, manage stock levels, and monitor inventory with real-time updates.',
    category: 'Full Stack',
    tags: ['Next.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    featured: false,
    image: '/projects/grocery_shop.png',
    demoUrl: 'https://github.com/Tanmoy052/grocery_shop',
    githubUrl: 'https://github.com/Tanmoy052/grocery_shop',
    starsCount: 0,
    metrics: [
      { label: 'Items', value: '1000+' },
      { label: 'Satisfied Customers', value: '100+' },
      { label: 'Turnaround Time', value: '1-2 hours' }
    ],
    features: [
      'Product showcase for local businesses',
      'Admin dashboard for managing products & orders',
      'WhatsApp integration & quick call buttons',
    ],
    architecture: [
      'Framework: Next.js + MongoDB Database',
      'Auth: JWT Authentication',
      'Styling: Tailwind CSS'
    ]
  },
  {
    id: 'weather-website',
    title: 'Weather Website',
    shortDescription: 'A production-ready weather website featuring current and future weather predictions.',
    fullDescription: 'A clean and responsive weather web app delivering real-time local weather forecasts, temperature trends, location search, and multi-day meteorological predictions.',
    category: 'Mini Apps',
    tags: ['Next.js', 'JavaScript', 'Tailwind CSS'],
    featured: false,
    image: '/projects/weather_website.png',
    demoUrl: 'https://weather-website-three-mu.vercel.app/',
    githubUrl: 'https://github.com/Tanmoy052/weather-website',
    starsCount: 18,
    metrics: [
      { label: 'API Latency', value: '120ms' },
      { label: 'Forecast', value: '7-Day' }
    ],
    features: [
      'Location auto-detect with instant forecast rendering',
      'Real-time temperature, humidity, wind, and air quality index',
      'Sleek dark mode weather dashboard UI',
      'Debounced search for global cities'
    ],
    architecture: [
      'Frontend: Next.js + JavaScript + Tailwind CSS'
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    iconName: 'Layout',
    skills: [
      { name: 'HTML5', level: 98, experience: '3+ yrs', description: 'Semantic markup, Web Vitals, Accessibility (a11y)', icon: 'Globe' },
      { name: 'CSS3', level: 95, experience: '3+ yrs', description: 'Flexbox, CSS Grid, Custom Properties, Animations', icon: 'Palette' },
      { name: 'JavaScript (ES6+)', level: 95, experience: '3+ yrs', description: 'Async/Await, Closures, DOM, ES Modules', icon: 'Code' },
      { name: 'React', level: 95, experience: '2+ yrs', description: 'React 19/18, Hooks, Virtual DOM, Context, State Engine', icon: 'Atom' },
      { name: 'Next.js', level: 85, experience: '1.5 yrs', description: 'App Router, Server Components, API Routes, SSR/SSG', icon: 'Zap' },
      { name: 'Tailwind CSS', level: 95, experience: '2+ yrs', description: 'Utility-first CSS, Responsive Tokens, Dark Mode', icon: 'Palette' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend',
    iconName: 'Server',
    skills: [
      { name: 'Node.js', level: 90, experience: '2+ yrs', description: 'Event Loop, Non-blocking I/O, Streams, npm Ecosystem', icon: 'Cpu' },
      { name: 'Express.js', level: 92, experience: '2+ yrs', description: 'RESTful API Routing, Middlewares, Rate Limiting', icon: 'Layers' },
      { name: 'REST APIs', level: 94, experience: '2+ yrs', description: 'API Design Standards, JSON, Status Codes, Swagger', icon: 'Network' },
      { name: 'Authentication', level: 88, experience: '2 yrs', description: 'JWT Tokens, OAuth 2.0, Bcrypt Hashing, HttpOnly Cookies', icon: 'ShieldCheck' }
    ]
  },
  {
    id: 'database',
    title: 'Database',
    iconName: 'Database',
    skills: [
      { name: 'MongoDB', level: 90, experience: '2 yrs', description: 'Document Schema, Aggregation Pipelines, Mongoose ORM', icon: 'Database' },
      { name: 'PostgreSQL', level: 82, experience: '1.5 yrs', description: 'Relational Schemas, SQL Queries, Joins, Indexing', icon: 'Table' },
      { name: 'Firebase', level: 85, experience: '1.5 yrs', description: 'Firestore NoSQL, Realtime Sync, Security Rules', icon: 'Flame' }
    ]
  },
  {
    id: 'tools',
    title: 'Tools',
    iconName: 'Wrench',
    skills: [
      { name: 'Git', level: 92, experience: '3 yrs', description: 'Version Control, Branching Strategy, PR Workflows', icon: 'GitBranch' },
      { name: 'Render', level: 88, experience: '1.5 yrs', description: 'Cloud App & Web Service Hosting, Auto Deployments', icon: 'Cloud' },
      { name: 'Vercel', level: 92, experience: '2 yrs', description: 'Edge Functions, Serverless Deployment, Analytics', icon: 'Zap' },
      { name: 'Netlify', level: 88, experience: '2 yrs', description: 'JAMstack Deployment, CI/CD Pipelines, Forms', icon: 'Globe' },
      { name: 'Sengrid', level: 85, experience: '1 yr', description: 'Transactional Email APIs, SMTP Integration', icon: 'Mail' }
    ]
  }
];

export const TIMELINE: TimelineItem[] = [
  {
    id: 'exp-1',
    year: '2026 - Present',
    role: 'Backend Developer',
    companyOrInstitution: 'Data Seva',
    location: 'India',
    type: 'Experience',
    description: '',
    skillsUsed: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Auth'],
    highlights: [
      'Developed and maintained scalable backend APIs using Node.js and Express.js.',
      'Designed and implemented MongoDB schemas and optimized database queries.',
      'Implemented authentication, authorization, and security best practices.'
    ]
  },
  {
    id: 'exp-2',
    year: '2023 - 2025',
    role: 'Freelance Web Developer',
    companyOrInstitution: 'Upwork / Fiverr',
    location: 'Remote',
    type: 'Experience',
    description: '',
    skillsUsed: ['WordPress', 'React', 'JavaScript', 'HTML/CSS'],
    highlights: [
      'Developed custom WordPress and React-based solutions for clients.',
      'Managed client communication and project requirements.'
    ]
  },
  {
    id: 'edu-1',
    year: '2023 - 2027',
    role: 'Bachelor of Technology in Computer Science & Engineering',
    companyOrInstitution: 'COOCH BEHAR GOVERNMENT ENGINEERING COLLEGE',
    location: 'Cooch Behar, West Bengal',
    type: 'Education',
    description: 'Specializing in core computer science disciplines including Data Structures, Algorithms, DBMS, and Modern Web Architectures. Maintaining a strong focus on building scalable and efficient software solutions.',
    skillsUsed: ['DSA', 'OOPS', 'OPERATING SYSTEMS', 'DBMS', 'WEB DEV'],
    highlights: []
  },
  {
    id: 'edu-2',
    year: '2022 - 2023',
    role: 'Bachelor of Science (Math, Physics, Chemistry)',
    companyOrInstitution: 'RANAGHAT COLLEGE',
    location: 'Ranaghat, West Bengal',
    type: 'Education',
    description: 'Advanced studies in Mathematics and Physical Sciences, providing a solid analytical and problem-solving foundation.',
    skillsUsed: ['MATHEMATICS', 'PHYSICS', 'CHEMISTRY'],
    highlights: []
  },
  {
    id: 'edu-3',
    year: '2020 - 2022',
    role: 'Higher Secondary (12th Grade)',
    companyOrInstitution: 'BIRNAGAR HIGH SCHOOL',
    location: 'Birnagar, Nadia, West Bengal',
    type: 'Education',
    description: 'Completed Higher Secondary education under WBCHSE with a Science focus, achieving deep understanding in STEM subjects.',
    skillsUsed: ['PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'BIOLOGY'],
    highlights: []
  },
  {
    id: 'edu-4',
    year: '2014 - 2020',
    role: 'Secondary Education (Madhyamik)',
    companyOrInstitution: 'RADHANAGAR HIGH SCHOOL',
    location: 'Radhanagar, Nadia, West Bengal',
    type: 'Education',
    description: 'Completed Secondary Education under WBBSE with a Science focus, developing core academic skills and interests in science and technology.',
    skillsUsed: ['SCIENCE', 'ENGLISH', 'BENGALI', 'HISTORY', 'GEOGRAPHY'],
    highlights: []
  }
];

export const PORTFOLIO_AUDIT_POINTS: AuditPoint[] = [
  {
    area: '1. Visual Identity & Contrast',
    observation: 'Original portfolio had flat static contrast and basic layout elements that lacked visual pop.',
    improvementMade: 'Upgraded to a high-contrast dark/light modern aesthetic with glowing accent borders, subtle backdrop blurs, and mathematical spacing rhythm.',
    impactScore: '10/10 Polish'
  },
  {
    area: '2. Interactivity & Motion',
    observation: 'Static project cards without live preview modals, code snippets, or filtering capabilities.',
    improvementMade: 'Added interactive tag filtering, instant keyword search, project star counters, code snippet viewer, and interactive architecture flows.',
    impactScore: 'High Engagement'
  },
  {
    area: '3. Developer Polish & Easter Eggs',
    observation: 'No interactive developer tools or unique personality showcase.',
    improvementMade: 'Built an interactive developer terminal (`tanmoy@portfolio:~$`), a Project Scope & Cost Estimator tool, and an AI Twin assistant.',
    impactScore: 'Memorable UX'
  },
  {
    area: '4. AI & Tech Integration',
    observation: 'No live AI features or interactive query assistant.',
    improvementMade: 'Integrated a server-side Gemini 3.6 Flash model power "Tanmoy\'s AI Twin" to answer visitor and recruiter questions directly.',
    impactScore: 'Cutting Edge'
  },
  {
    area: '5. Navigation & Accessibility',
    observation: 'Basic navigation without smooth section tracking or customizable themes.',
    improvementMade: 'Implemented smooth scroll IntersectionObserver tracking, Theme switcher (Dark, Light, Matrix), Accent Color Picker, and full WCAG AA contrast.',
    impactScore: '100/100 UX'
  }
];
