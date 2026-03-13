import os

def extract_text(filepath):
    """Extract text from PDF, DOCX, or TXT files."""
    ext = os.path.splitext(filepath)[1].lower()

    if ext == '.pdf':
        return _extract_pdf(filepath)
    elif ext == '.docx':
        return _extract_docx(filepath)
    elif ext == '.txt':
        return _extract_txt(filepath)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def _extract_pdf(filepath):
    try:
        import pdfplumber
        text = []
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                content = page.extract_text()
                if content:
                    text.append(content)
        return '\n'.join(text)
    except ImportError:
        import PyPDF2
        text = []
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text.append(page.extract_text() or '')
        return '\n'.join(text)

def _extract_docx(filepath):
    from docx import Document
    doc = Document(filepath)
    return '\n'.join([para.text for para in doc.paragraphs if para.text.strip()])

def _extract_txt(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()
