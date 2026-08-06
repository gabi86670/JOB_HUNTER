# JOB_HUNTER
architecture:
               React Frontend
                      │
          Upload Resume + Preferences
                      │
                Express/Nest Backend
                      │
      ┌───────────────┼────────────────┐
      │               │                │
 Resume Parser   AI Job Agent     Job Search Service
      │               │                │
Extract Skills   Clarify Intent   Query Job APIs
      │               │                │
      └───────────────┼────────────────┘
                      │
             Ranking / Matching Engine
                      │
             Results + AI Explanations

Frontend: React + Vite + Tailwind
Backend: Node + Express 
Database: PostgreSQL
ORM: Prisma
Authentication: Clerk or Supabase Auth
LLM: OpenAI Responses API or Anthropic
Deployment: Vercel (frontend) + Railway/Fly.io (backend


security concerns
- pdf isnt malicious (ie someone telling the chatbot to ignore its commands)
