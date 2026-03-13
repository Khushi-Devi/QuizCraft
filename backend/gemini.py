from groq import Groq
from dotenv import load_dotenv
import os
import json
import re
import math
load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

MODEL_NAME = "llama-3.3-70b-versatile"


client = Groq(api_key=GROQ_API_KEY)

def _difficulty_distribution(n):
    easy   = math.ceil(n * 0.4)
    medium = math.ceil(n * 0.4)
    hard   = n - easy - medium
    if hard < 0:
        hard = 0
    return easy, medium, hard

def generate_quiz(text, num_questions):
    """Generate quiz questions from study material using Groq."""
    easy, medium, hard = _difficulty_distribution(num_questions)

    prompt = f"""You are an expert quiz creator. Based on the study material below, generate exactly {num_questions} multiple-choice questions.

Difficulty distribution:
- Easy: {easy} questions
- Medium: {medium} questions
- Hard: {hard} questions

Return ONLY a valid JSON array with no extra text, markdown, or code fences.
Each item must follow this exact format:
{{
  "question": "Question text here",
  "difficulty": "easy",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The correct option text (must match one of the options exactly)",
  "explanation": "A clear, concise explanation of why this answer is correct"
}}

Rules:
- options must be an array of exactly 4 strings
- answer must match one option exactly
- explanation should be educational and helpful
- Cover different topics across the material
- Do not number the questions

Study Material:
\"\"\"{text[:12000]}\"\"\"
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    questions = json.loads(raw)
    return questions


def generate_feedback(incorrect_questions, score, total):
    """Generate AI performance feedback based on quiz results."""
    if not incorrect_questions:
        return "Excellent! You answered every question correctly. Outstanding performance!"

    topics = [q.get('question', '')[:80] for q in incorrect_questions[:5]]
    accuracy = round((score / total) * 100)

    prompt = f"""A student just completed a quiz and scored {score}/{total} ({accuracy}% accuracy).

They answered these questions incorrectly:
{chr(10).join(f'- {t}' for t in topics)}

Write a short, encouraging performance feedback (3-5 sentences max).
Include:
1. One sentence about their overall performance
2. The specific weak areas based on the missed questions
3. One motivating closing sentence

Format the weak areas as a bullet list. Keep it friendly and constructive."""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=512,
    )

    return response.choices[0].message.content.strip()