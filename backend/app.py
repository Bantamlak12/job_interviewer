import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-preview")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is required in the environment")

app = FastAPI(title="Job Interviewer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_questions(job_title: str) -> List[str]:
    prompt = (
        f"Generate exactly 3 interview questions for a {job_title} role. "
        "Return only the questions, one per line."
    )

    client = genai.Client()
    response = client.models.generate_content(
    model=GEMINI_MODEL, contents=prompt

)
    
    text = response.text.split('\n')

    questions = text
    if len(questions) != 3:
        raise HTTPException(status_code=502, detail="Gemini response did not include exactly 3 questions")

    return questions


class QuestionRequest(BaseModel):
    jobTitle: str = Field(..., min_length=1)


class QuestionResponse(BaseModel):
    questions: List[str]


@app.post("/questions", response_model=QuestionResponse)
def create_questions(request: QuestionRequest):
    try:
        questions = generate_questions(request.jobTitle)
        return {"questions": questions}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
