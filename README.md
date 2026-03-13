# QuizCraft — AI-Powered Quiz Generator

Transform any study material into interactive, AI-generated quizzes.  
Built with Flask · React · Gemini 1.5 Flash · SQLite.

---

## Project Structure

```
quiz-creator/
├── backend/
│   ├── app.py           # Flask REST API
│   ├── gemini.py        # Gemini AI integration  ← ADD YOUR API KEY HERE
│   ├── database.py      # SQLAlchemy models
│   ├── file_parser.py   # PDF / DOCX / TXT extraction
│   ├── requirements.txt
│   └── uploads/         # Uploaded files (auto-created)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FileUpload.jsx
    │   │   ├── QuizCard.jsx    # Flip-card with animation
    │   │   └── ScoreCard.jsx
    │   ├── pages/
    │   │   ├── UploadPage.jsx
    │   │   ├── QuizPage.jsx
    │   │   ├── ResultPage.jsx
    │   │   └── HistoryPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## Setup

### 1. Add your Gemini API Key

Open `backend/gemini.py` and replace the placeholder:

```python
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"
```

Get a free key at: https://aistudio.google.com/app/apikey

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at: http://localhost:5000

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Features

| Feature | Description |
|---|---|
| 📄 File Upload | PDF, DOCX, TXT — up to 16 MB |
| 🤖 AI Generation | Gemini 1.5 Flash generates structured quizzes |
| 🎯 Difficulty | 40% Easy · 40% Medium · 20% Hard |
| 🃏 Flip Cards | Double-click cards to reveal explanations |
| 📝 Quiz Mode | Answer and receive scored results |
| 📖 Study Mode | Cards reveal answers immediately |
| 📄 Pagination | 10 questions per page for large quizzes |
| 💬 AI Feedback | Gemini analyses your weak areas |
| 📊 History | SQLite stores all quizzes and attempts |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload file and extract text |
| POST | `/generate-quiz` | Generate quiz with Gemini |
| GET | `/quiz/<id>` | Fetch quiz by ID |
| POST | `/submit-quiz` | Submit answers and get score |
| GET | `/quiz-history` | All quizzes and attempts |
| DELETE | `/quiz/<id>` | Delete a quiz |

---

## Theme

Lavender & Light Grey — gentle, modern, and learning-focused.  
Fonts: Cormorant Garamond (headings) · DM Sans (body)
