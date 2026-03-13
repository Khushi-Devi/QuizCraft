import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from database import db, Quiz, Attempt
from file_parser import extract_text
from gemini import generate_quiz, generate_feedback

# ── App Setup ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'quiz.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

db.init_app(app)

with app.app_context():
    db.create_all()

# ── Helpers ────────────────────────────────────────────────────────────────
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ── Routes ─────────────────────────────────────────────────────────────────

@app.route('/upload', methods=['POST'])
def upload_file():
    """Upload study material and extract text."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid or unsupported file type. Use PDF, DOCX, or TXT.'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        text = extract_text(filepath)
        if not text or len(text.strip()) < 50:
            return jsonify({'error': 'Could not extract enough text from the file.'}), 400

        # Auto-generate title from filename (strip extension)
        title = os.path.splitext(filename)[0].replace('_', ' ').replace('-', ' ').title()

        return jsonify({
            'text': text[:15000],
            'filename': filename,
            'title': title,
            'char_count': len(text)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz_route():
    """Generate quiz from extracted text using Gemini."""
    data = request.get_json()
    text = data.get('text', '')
    num_questions = int(data.get('num_questions', 10))
    title = data.get('title', 'Untitled Quiz')

    if not text:
        return jsonify({'error': 'No text provided'}), 400
    if not (1 <= num_questions <= 50):
        return jsonify({'error': 'Number of questions must be between 1 and 50'}), 400

    try:
        questions = generate_quiz(text, num_questions)

        quiz = Quiz(
            title=title,
            num_questions=len(questions),
            questions_json=json.dumps(questions)
        )
        db.session.add(quiz)
        db.session.commit()

        return jsonify({
            'quiz_id': quiz.id,
            'title': quiz.title,
            'questions': questions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    """Fetch a quiz by ID."""
    quiz = Quiz.query.get_or_404(quiz_id)
    return jsonify({
        'id': quiz.id,
        'title': quiz.title,
        'num_questions': quiz.num_questions,
        'questions': json.loads(quiz.questions_json),
        'created_at': quiz.created_at.isoformat()
    })

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    """Calculate score, generate feedback, and store attempt."""
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    answers = data.get('answers', {})  # { "0": "Option A", "1": "Option C", ... }

    quiz = Quiz.query.get_or_404(quiz_id)
    questions = json.loads(quiz.questions_json)

    score = 0
    incorrect = []
    for i, q in enumerate(questions):
        user_answer = answers.get(str(i), '')
        if user_answer.strip().lower() == q['answer'].strip().lower():
            score += 1
        else:
            incorrect.append(q)

    total = len(questions)
    accuracy = round((score / total) * 100, 1) if total > 0 else 0

    try:
        feedback = generate_feedback(incorrect, score, total)
    except Exception:
        feedback = f"You scored {score}/{total}. Keep practicing to improve!"

    attempt = Attempt(
        quiz_id=quiz_id,
        score=score,
        total_questions=total,
        accuracy=accuracy,
        feedback=feedback
    )
    db.session.add(attempt)
    db.session.commit()

    return jsonify({
        'attempt_id': attempt.id,
        'score': score,
        'total': total,
        'accuracy': accuracy,
        'feedback': feedback,
        'incorrect_count': len(incorrect)
    })

@app.route('/quiz-history', methods=['GET'])
def quiz_history():
    """Return all quizzes and their attempts."""
    quizzes = Quiz.query.order_by(Quiz.created_at.desc()).all()
    result = []
    for quiz in quizzes:
        attempts = [a.to_dict() for a in quiz.attempts]
        q_dict = quiz.to_dict()
        q_dict['attempts'] = attempts
        result.append(q_dict)
    return jsonify(result)

@app.route('/quiz/<int:quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    db.session.delete(quiz)
    db.session.commit()
    return jsonify({'message': 'Quiz deleted'})

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'QuizCraft API is running. Open http://localhost:3000 for the app.',
        'endpoints': ['/upload', '/generate-quiz', '/quiz/<id>', '/submit-quiz', '/quiz-history']
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)