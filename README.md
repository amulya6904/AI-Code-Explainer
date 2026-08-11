# Codexa AI

### Adaptive AI-Based Java Programming Tutor

Codexa AI is an intelligent programming education platform designed to help beginner programmers learn Java through guided debugging, progressive AI hints, interactive complexity visualization, structured study material, and personalized learning analytics.

Unlike conventional AI coding assistants that directly generate complete solutions, Codexa AI is designed as an **AI Teaching Assistant**. It helps students understand why their code fails and guides them progressively toward the solution while preserving independent problem-solving.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Workflow](#system-workflow)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Evaluation Results](#evaluation-results)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Learning Analytics](#learning-analytics)
- [Reliability and Academic Integrity](#reliability-and-academic-integrity)
- [Documentation](#documentation)
- [Future Scope](#future-scope)
- [Project Philosophy](#project-philosophy)
- [Author](#author)

---

## Overview

Learning programming is not only about writing code. A major part of the learning process is understanding why code fails and how to correct it.

Many AI coding assistants directly generate complete solutions, which can encourage passive learning and copy-paste behavior. Codexa AI takes a different approach.

When a student submits code, the platform:

1. Compiles and executes the program.
2. Detects compilation, runtime, and output-related errors.
3. Analyzes the error and the relevant programming concept.
4. Generates progressive AI-powered hints.
5. Validates AI responses using deterministic safety guardrails.
6. Tracks student performance and hint usage.
7. Updates topic-level learning analytics.
8. Provides personalized learning recommendations.

The goal is not to give students the answer, but to help them **arrive at the answer themselves**.

---

## Key Features

### 1. AI-Powered Progressive Hint System

Codexa AI provides hints progressively instead of revealing a complete solution immediately.

- **Level 1 — Conceptual Guidance:** Helps the student identify the relevant concept or problematic area.
- **Level 2 — Logical Guidance:** Provides more specific reasoning about what may need to change.
- **Level 3 — Limited Code Guidance:** Provides limited code-level guidance while still preventing full-solution generation.

A generated hint can contain:

- Problem summary
- Explanation of why the error occurs
- Hint Level 1
- Hint Level 2
- Hint Level 3
- Learning tip

The system enforces a strict **no-full-solution policy** to support independent learning and academic integrity.

### 2. Secure Java Code Execution

Student Java programs are compiled and executed through a controlled backend execution pipeline.

The execution engine supports:

- Java compilation using `javac`
- Runtime execution
- Compilation error detection
- Runtime exception detection
- Stack-trace parsing
- Error-line extraction
- Program output capture
- Output mismatch detection
- Execution timeout protection
- Temporary sandbox directories
- Automatic cleanup after execution

### 3. Hallucination Guard

LLM output is not directly returned to the student.

Codexa AI includes a deterministic **Hallucination Guard** that validates AI-generated responses before they reach the frontend.

The guard checks for:

- Missing required fields
- Empty responses
- Invalid data types
- Markdown code blocks
- Full-solution leakage
- Malformed responses
- Policy violations

If a response fails validation, the system automatically moves to the fallback pipeline.

### 4. Multi-Level Fallback Engine

Codexa AI is designed to continue providing useful guidance even when the LLM is unavailable or returns an invalid response.

```text
Primary LLM Response
        |
        v
Hallucination Guard
        |
        +---- Valid --------------------> Return Hint
        |
        v
Strict LLM Retry
        |
        +---- Valid --------------------> Return Hint
        |
        v
Template-Based Hint
        |
        +---- Match --------------------> Return Hint
        |
        v
Generic Safe Educational Hint
```

This architecture ensures that an AI failure does not automatically become an application failure.

### 5. Hint Confidence Scoring

Codexa AI includes a confidence scoring mechanism for generated hints.

The score considers signals such as:

- Fallback tier used
- Error-context relevance
- Hint completeness
- Question-context availability
- Hallucination detection
- Hint structure
- Hint length

This provides an internal trust signal that can later be compared with real user feedback.

### 6. Topic Detection and Adaptive Learning

Codexa AI automatically maps programming errors and submissions to Java learning topics such as:

- Variables
- Java syntax
- Conditions
- Loops
- Arrays
- Methods
- Object-Oriented Programming
- Exception Handling
- Type Casting
- Object Handling

Topics can be classified into learning states such as:

```text
Weak -> Improving -> Strong
```

This helps identify areas where a student requires additional practice.

### 7. Personalized Learning Analytics

The learning dashboard tracks:

- Total submissions
- Problems solved
- Current coding streak
- Longest streak
- Topic-level performance
- Topic mastery
- Error-frequency breakdown
- Recent submission activity
- Hint usage
- Hint-weighted success rate
- Personalized recommendations
- Encouragement messages

The system uses submission history stored in MongoDB to generate these insights.

### 8. Interactive Complexity Simulator

Codexa AI includes an interactive complexity simulator for both **Java and Python**.

#### Time Complexity Analysis

The simulator identifies:

- Sequential statements
- Loops
- Nested loops
- Logarithmic loops
- Recursive calls
- Mixed complexity patterns

Supported evaluated complexity classes include:

```text
O(1)
O(n)
O(n²)
O(n³)
O(log n)
O(n log n)
O(n² log n)
```

#### Space Complexity Analysis

The simulator visualizes:

- Stack frames
- Heap allocations
- Arrays
- Objects
- Recursive stack growth
- Variable allocations
- Overall memory growth

Playback controls include:

- Play
- Pause
- Step forward
- Step backward
- Playback speed control

### 9. AST-Based Code Analysis

The complexity simulator uses **Tree-sitter** to convert Java and Python source code into a structured Abstract Syntax Tree.

The backend extracts constructs such as:

- Functions
- Loops
- Conditions
- Variables
- Assignments
- Function calls

The AST is transformed into a language-independent representation consumed by the frontend simulation engine.

### 10. Java Practice Environment

The Practice workspace provides an IDE-like environment using the Monaco Editor.

Students can:

- Select programming problems
- Write Java code
- Run code
- Submit solutions
- View compiler and runtime output
- Receive progressive hints
- Reset starter code
- Use fullscreen editor mode
- Track hint usage
- Submit feedback on hint quality

The current problem catalog includes structured exercises across:

- Java Basics
- Conditions
- Loops
- Arrays

Problems are organized across **Easy**, **Medium**, and **Hard** difficulty levels.

### 11. Structured Java Study Module

Codexa AI includes a structured Java study module containing **31 chapters**.

Study features include:

- Chapter navigation
- Structured explanations
- Java code examples
- Runnable code snippets
- Chapter quizzes
- Progress tracking
- Previous/Next navigation
- Practice-topic integration

Study code examples can be executed through a lightweight execution endpoint without affecting the student's primary submission analytics.

### 12. Code Execution Video Generation

Codexa AI includes a video-generation workflow for visualizing Java code execution.

Students can:

1. Write Java code.
2. Execute and validate the program.
3. Generate an animated visualization.
4. Track rendering progress.
5. Play the generated video inside the application.

The video rendering pipeline integrates with an external Manim-based rendering service.

Supported rendering quality options include:

- 480p
- 720p
- 1080p
- 1440p

---

## System Workflow

```text
Student
   |
   v
React / Vite Frontend
   |
   v
Flask REST API
   |
   +----------------------+
   |                      |
   v                      v
Java Execution        AST Analysis
Engine                (Tree-sitter)
   |
   v
Error / Output Analysis
   |
   v
Qwen3 Coder via RouteLLM API
   |
   v
Hallucination Guard
   |
   v
Fallback Pipeline
   |
   v
Structured Progressive Hint
   |
   v
MongoDB Learning Analytics
```

---

## Architecture

```text
                    +----------------------+
                    |       Student        |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |   React / Vite UI    |
                    |    Monaco Editor     |
                    +----------+-----------+
                               |
                            REST API
                               |
                               v
                    +----------------------+
                    |    Flask Backend     |
                    +----------+-----------+
                               |
          +--------------------+--------------------+
          |                    |                    |
          v                    v                    v
 +----------------+   +----------------+   +----------------+
 | Java Execution |   |  AST Analysis  |   | Learning Data  |
 |     Engine     |   |  Tree-sitter   |   |    MongoDB     |
 +----------------+   +----------------+   +----------------+
          |
          v
 +------------------------+
 | AI Hint Generation     |
 | Qwen3 Coder via        |
 | RouteLLM API           |
 +-----------+------------+
             |
             v
 +------------------------+
 | Hallucination Guard    |
 +-----------+------------+
             |
             v
 +------------------------+
 | Fallback Pipeline      |
 +-----------+------------+
             |
             v
 +------------------------+
 | Structured Student Hint|
 +------------------------+
```

---

## Technology Stack

### Frontend

- React 19
- Vite 8
- JavaScript / JSX
- Monaco Editor
- Zustand
- Recharts
- Framer Motion
- Tailwind CSS
- Axios

### Backend

- Python 3.10+
- Flask
- Flask-CORS
- PyMongo
- Tree-sitter
- Tree-sitter Java
- Tree-sitter Python
- Java subprocess execution
- REST APIs

### Database

- MongoDB
- MongoDB Atlas or local MongoDB instance

### AI Integration

- Qwen3 Coder 480B-A35B
- RouteLLM API
- OpenAI-compatible inference interface

### Visualization

- Recharts
- Custom React simulation engine
- Monaco Editor line highlighting
- Manim-based rendering service

---

## Evaluation Results

The system was evaluated across its major AI and analysis components using dedicated evaluation datasets.

### AI Hint Quality Evaluation

**Evaluation samples: 30**

| Metric | Score |
|---|---:|
| Overall Hint Quality | **89.11%** |
| Relevance | **82.78%** |
| Completeness | **93.33%** |
| Specificity | **93.33%** |
| No-Full-Solution Compliance | **100%** |

The evaluation covered multiple Java error categories, including:

- Syntax errors
- Type errors
- Symbol errors
- NullPointerException
- ArrayIndexOutOfBoundsException
- StackOverflow
- ArithmeticException
- ClassCastException
- StringIndexOutOfBoundsException
- NumberFormatException
- Logic errors
- Scope errors
- Access errors

The no-full-solution policy achieved **100% compliance** in the evaluation set.

### Hallucination Guard Evaluation

**Evaluation samples: 30**

| Metric | Result |
|---|---:|
| Overall Accuracy | **100%** |
| True Positive Rate | **100%** |
| True Negative Rate | **100%** |
| False Positives | **0** |
| False Negatives | **0** |

The evaluation included:

- Valid responses
- Missing required keys
- Empty required fields
- Markdown code fences
- Full-solution leakage
- Invalid field types

The hallucination guard correctly classified all evaluated cases.

### Time Complexity Analyzer Evaluation

**Evaluation samples: 30**

| Metric | Result |
|---|---:|
| Overall Accuracy | **96.67%** |
| Correct Predictions | **29 / 30** |

#### Accuracy by Complexity Class

| Complexity | Accuracy |
|---|---:|
| O(1) | **100%** |
| O(n) | **100%** |
| O(n²) | **100%** |
| O(n³) | **100%** |
| O(log n) | **75%** |
| O(n log n) | **100%** |
| O(n² log n) | **100%** |

The evaluation demonstrates strong performance across constant, linear, quadratic, cubic, logarithmic, and mixed complexity patterns.

---

## API Overview

The Flask backend exposes REST endpoints including:

```text
GET  /api/health
POST /api/submit-code
POST /api/execute-code
POST /api/request-hint
POST /api/parse-ast
POST /api/feedback
GET  /api/learning-summary/<user_id>
GET  /api/study/topic/<chapter_id>
```

All backend responses use a unified response structure.

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## Project Structure

```text
AI-Code-Explainer/
│
├── backend/
│   ├── app.py
│   ├── routes.py
│   ├── java_engine.py
│   ├── llm.py
│   ├── hallucination_guard.py
│   ├── fallback_engine.py
│   ├── confidence_scorer.py
│   ├── hint_manager.py
│   ├── submission_service.py
│   ├── topic_analyzer.py
│   ├── encouragement_engine.py
│   ├── ast_parser.py
│   ├── database.py
│   ├── response.py
│   ├── study_prompts.py
│   ├── study_curated_content.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── simulator/
│   │   ├── stores/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── evaluation/
│   ├── hint_accuracy_eval.py
│   ├── hint_eval_results.json
│   ├── hallucination_guard_eval.py
│   ├── hallucination_guard_results.json
│   ├── time_complexity_eval.py
│   ├── time_complexity_eval_v2.py
│   └── time_complexity_results_v2.json
│
├── test_ast_parser.py
├── test_fallback_engine.py
├── test_flask_backend.py
├── test_hint_manager.py
├── test_java_engine.py
├── test_llm.py
└── README.md
```

---

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Python 3.10+
- Node.js
- npm
- Java JDK
- MongoDB or MongoDB Atlas access
- Git

### Clone the Repository

```bash
git clone https://github.com/amulya6904/AI-Code-Explainer.git
cd AI-Code-Explainer
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment.

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and configure the required environment variables for:

- MongoDB
- RouteLLM / LLM access
- Any environment-specific backend configuration

Start the backend:

```bash
python app.py
```

The backend runs locally on:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will start using the local Vite development server.

---

## Learning Analytics

### Hint-Weighted Success Model

Codexa AI uses hint-weighted success scoring instead of treating every successful submission equally.

```text
0 hints  -> 1.0
1 hint   -> 0.7
2 hints  -> 0.4
3 hints  -> 0.1
4+ hints -> 0.0
```

This makes the success metric more representative of independent problem-solving ability.

### Topic Status Classification

The platform analyzes performance over time and can classify topics into states such as:

```text
WEAK
IMPROVING
STRONG
NEUTRAL
```

### Hint Feedback

Students can rate generated hints as helpful or not helpful.

The feedback is associated with the originating submission and can be used to compare:

```text
Automated Confidence Score
            vs
Human Hint Feedback
```

This creates a foundation for future confidence-score calibration.

---

## Reliability and Academic Integrity

### Reliability and Safety

The AI subsystem is wrapped with deterministic validation and fallback mechanisms.

```text
Primary LLM
    |
    v
Hallucination Guard
    |
    v
Strict Retry
    |
    v
Template-Based Hint
    |
    v
Generic Safe Hint
```

This design helps keep the tutoring experience available even if the model fails or returns an invalid output.

### Academic Integrity

Codexa AI is intentionally designed to support learning rather than replace it.

The platform:

- Avoids complete corrected programs
- Restricts generated code guidance
- Reveals hints progressively
- Encourages self-correction
- Validates AI-generated responses
- Tracks hint assistance
- Promotes conceptual understanding

The platform is therefore designed as an educational tutor rather than an automated solution generator.

---

## Design Philosophy

The frontend is designed as a dark-themed, IDE-inspired learning environment.

The interface prioritizes:

- Readability
- Clear coding workflows
- Minimal distraction
- Responsive design
- Interactive feedback
- Progressive learning
- Visual explanation of complexity concepts

---

## Documentation

Detailed technical documentation is available inside the repository:

- `backend/README.md`
- `frontend/README.md`
- `README_manim_video.md`

The backend documentation covers:

- API architecture
- Java execution engine
- LLM integration
- Hallucination guard
- Fallback mechanisms
- Confidence scoring
- MongoDB architecture
- Learning analytics

The frontend documentation covers:

- React architecture
- Practice workspace
- Dashboard
- Progress analytics
- Complexity simulator
- Study module
- Video generation
- State management
- Design system

### Evaluation Artifacts

Evaluation scripts and result files are available in the `evaluation/` directory:

```text
hint_accuracy_eval.py
hint_eval_results.json
hallucination_guard_eval.py
hallucination_guard_results.json
time_complexity_eval.py
time_complexity_eval_v2.py
time_complexity_results_v2.json
```

These artifacts are included to make the reported evaluation metrics reproducible and transparent.

---

## Future Scope

Potential extensions include:

- Additional programming languages
- More advanced DSA topics
- Retrieval-Augmented Generation for learning resources
- Personalized learning-path generation
- Instructor dashboards
- Classroom-level analytics
- Adaptive question recommendation
- Expanded complexity analysis
- Larger automated evaluation datasets
- Cloud deployment
- Collaborative learning features
- Real-time instructor feedback
- AI-assisted curriculum recommendation

---

## Project Philosophy

> **Don't give the learner the answer. Give them enough guidance to discover it.**

Codexa AI aims to transform debugging from a frustrating trial-and-error process into a structured, measurable, and adaptive learning experience.

---

## Author

**Amulya**  
Computer Science Engineering

Repository: `https://github.com/amulya6904/AI-Code-Explainer`

---

## Project Use

This project is intended for educational and research purposes.
