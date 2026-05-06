# ResumeAI — Full-Stack Resume Builder

A production-ready Resume Builder SaaS with real-time preview, 3 templates, AI-powered improvements, PDF export, and user authentication.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19 + TypeScript + Tailwind CSS v4 |
| Backend   | Node.js + Express.js                    |
| Database  | MongoDB + Mongoose                      |
| PDF       | html2pdf.js                             |
| State     | Zustand (persisted to localStorage)     |
| Auth      | JWT (bcryptjs + jsonwebtoken)           |
| AI        | OpenAI GPT-3.5-turbo                    |

## Project Structure

```
Builder/
├── frontend/               # React + TypeScript + Tailwind
│   └── src/
│       ├── components/
│       │   ├── form/       # PersonalInfo, Summary, Skills, Experience, Projects, Education
│       │   ├── preview/    # Minimal, Modern, Professional templates
│       │   ├── ui/         # Button, Input, Textarea, Section
│       │   ├── Navbar.tsx
│       │   └── AuthModal.tsx
│       ├── pages/
│       │   └── BuilderPage.tsx
│       ├── store/          # Zustand store
│       ├── types/          # TypeScript interfaces
│       └── utils/          # api, pdf, nanoid
└── backend/                # Node.js + Express
    ├── server.js
    └── src/
        ├── controllers/    # auth, resume, ai
        ├── middleware/     # JWT auth
        ├── models/         # User, Resume
        └── routes/         # /api/auth, /api/resumes, /api/ai
```

## Quick Start

### 1. Start both servers
```bash
# Windows — double-click start.bat, OR run manually:
cd backend && npm run dev
cd frontend && npm run dev
```

### 2. Configure environment
Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/resumebuilder
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-...          # Required for AI features
CLIENT_URL=http://localhost:5173
```

### 3. Open the app
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

## Features

### Core
- **Live Preview** — Real-time resume preview as you type
- **3 Templates** — Minimal, Modern (sidebar), Professional (blue accents)
- **PDF Download** — A4, proper margins, one-page layout
- **JSON Export/Import** — Save and reload resume data

### AI (requires OpenAI API key)
- **Improve Summary** — Rewrites summary with strong, ATS-friendly language
- **Improve Bullets** — Rewrites experience/project bullets with action verbs + metrics

### Auth
- Sign up / Login with JWT
- Resumes saved to MongoDB per user

### UX
- Dark mode toggle
- Collapsible form sections
- Add/remove dynamic entries (experience, projects, education, skill categories)
- Responsive layout

## API Endpoints

| Method | Endpoint                  | Auth | Description          |
|--------|---------------------------|------|----------------------|
| POST   | /api/auth/signup          | No   | Register user        |
| POST   | /api/auth/login           | No   | Login user           |
| GET    | /api/resumes              | Yes  | List user's resumes  |
| POST   | /api/resumes              | Yes  | Save resume          |
| PUT    | /api/resumes/:id          | Yes  | Update resume        |
| DELETE | /api/resumes/:id          | Yes  | Delete resume        |
| POST   | /api/ai/improve-summary   | No   | AI improve summary   |
| POST   | /api/ai/improve-bullets   | No   | AI improve bullets   |

## Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
```

### Backend → Render / Railway
- Set environment variables in dashboard
- Use `npm start` as start command
- Use MongoDB Atlas for production DB
