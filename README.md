# Job Interviewer

A simple full-stack application with a React frontend and a Python backend.

## Features

- Enter a job title.
- Fetch 3 generated interview questions from the Gemini API.
- Show loading state and error handling.

## Setup

### Backend

1. Create a Python virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Set `GEMINI_API_KEY` in `backend/.env`.

4. Start the backend:

```bash
uvicorn app:app --reload
```

### Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend:

```bash
npm run dev -- --host
```

### Usage

Open the Vite URL shown in the terminal and enter a job title. The React app will request questions from the Python backend.
