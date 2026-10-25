An AI-powered interview platform that generates customized questions, evaluates user responses, and provides targeted performance feedback.GenAI
An interview preparation platform powered by generative AI that creates tailored interview scenarios, evaluates user responses, and delivers structured feedback.

## Live Project

[Open InterviewAI](https://interview-ai-wheat-chi.vercel.app/)

Overview
This project helps candidates prepare for technical and behavioral interviews. It leverages large language models to assess a user target role, generate realistic interview questions, and evaluate candidate performance with targeted scoring and actionable insights.

Features
Role-based question generation: Generates targeted interview questions tailored to specific job profiles and technical domains.

AI response evaluation: Analyzes candidate answers for depth, clarity, and technical accuracy.

Performance feedback: Delivers detailed assessments highlighting strengths and areas for improvement.

Secure user authentication: Protects candidate profiles and session history using JWT authentication.

Tech Stack
Frontend
React

React Router

Axios

Vite

Backend
Node.js

Express.js

Google Gemini API

MongoDB with Mongoose

JSON Web Tokens

Getting Started
Prerequisites
Node.js installed locally

MongoDB Atlas account or local MongoDB instance

Google Gemini API key

Installation
Clone the repository:

Bash
git clone https://github.com/Mohd-Dilshan/interviewAI.git
cd interviewAI
Configure backend environment:

Bash
cd Backend
npm install
Create a `.env` file in the Backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
FRONTEND_URL=http://localhost:5173
```

The backend uses the `PORT` provided by the host and falls back to `3000` locally. Start the backend server:

```bash
npm run dev
```
Configure frontend environment:

Bash
cd ../Frontend
npm install
npm run dev
The client application will start on http://localhost:5173 and communicate with the backend on http://localhost:3000.

## Deployment

### Render (backend)

- Set the service root directory to `Backend`.
- Use `npm install` as the build command and `npm start` as the start command.
- Add `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY` as environment variables.
- Set `FRONTEND_URL` to your deployed Vercel site origin (for example, `https://your-app.vercel.app`, without a trailing slash).
- Set `NODE_ENV` to `production`. Render provides `PORT` automatically.

### Vercel (frontend)

- Set the project root directory to `Frontend`.
- Use `npm run build` as the build command and `dist` as the output directory.
- Set `VITE_API_URL` to your deployed Render backend origin (for example, `https://your-api.onrender.com`, without a trailing slash).
- Redeploy after setting or changing environment variables.

The frontend sends credentialed requests for cookie-based authentication. The backend's production cookie settings require HTTPS.

Author
Mohd Dilshan

GitHub: @Mohd-Dilshan
