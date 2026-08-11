# Codexa AI

### Adaptive AI-Based Java Programming Tutor

Codexa AI is an intelligent programming education platform designed to help beginner programmers learn Java through guided debugging, progressive AI hints, interactive complexity visualization, structured study material, and personalized learning analytics.

Unlike conventional AI coding assistants that directly generate complete solutions, Codexa AI is designed as an **AI Teaching Assistant**. It helps students understand why their code fails and guides them progressively toward the solution while preserving independent problem-solving.

---

## Overview

Learning programming is not only about writing code. A major part of the learning process is understanding why code fails and how to correct it.

Many AI coding assistants directly generate complete solutions, which can encourage passive learning and copy-paste behavior.

Codexa AI takes a different approach.

When a student submits code, the platform:

1. Compiles and executes the program.
2. Detects compilation, runtime, and output-related errors.
3. Analyzes the error and relevant programming concept.
4. Generates progressive AI-powered hints.
5. Validates AI responses using deterministic safety guardrails.
6. Tracks student performance and hint usage.
7. Updates topic-level learning analytics.
8. Provides personalized learning recommendations.

The goal is not to give students the answer, but to help them **arrive at the answer themselves**.

---

# Key Features

## AI-Powered Progressive Hint System

Codexa AI provides hints progressively instead of revealing a complete solution immediately.

### Level 1 — Conceptual Guidance

Provides a high-level hint that helps the student identify the relevant concept or problematic area.

### Level 2 — Logical Guidance

Provides more specific reasoning about what may need to be changed.

### Level 3 — Limited Code Guidance

Provides limited code-level guidance while still preventing complete solution generation.

A generated hint can contain:

- Problem summary
- Explanation of why the error occurs
- Hint Level 1
- Hint Level 2
- Hint Level 3
- Learning tip

The system enforces a strict **no-full-solution policy** to support independent learning and academic integrity.

---

## Secure Java Code Execution

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

This prevents failed or long-running programs from affecting the application.

---

## Hallucination Guard

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

---

## Multi-Level Fallback Engine

Codexa AI is designed to continue providing useful guidance even when the LLM is unavailable or returns an invalid response.

The fallback pipeline follows four stages:

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

This architecture ensures that an AI failure does not automatically become an application failure.

Hint Confidence Scoring

Codexa AI includes a confidence scoring mechanism for generated hints.

The score considers signals such as:

Fallback tier used
Error-context relevance
Hint completeness
Question context availability
Hallucination detection
Hint structure
Hint length

This provides an internal trust signal that can later be compared with real user feedback.

Topic Detection and Adaptive Learning

Codexa AI automatically maps programming errors and submissions to Java learning topics.

Examples include:

Variables
Java syntax
Conditions
Loops
Arrays
Methods
Object-Oriented Programming
Exception Handling
Type Casting
Object Handling

The platform tracks student performance across these topics.

Topics can be classified into learning states such as:

Weak -> Improving -> Strong

This makes it possible to identify areas where a student requires additional practice.

Personalized Learning Analytics

Codexa AI provides a learning analytics dashboard containing:

Total submissions
Problems solved
Current coding streak
Longest streak
Topic-level performance
Topic mastery
Error-frequency breakdown
Recent submission activity
Hint usage
Hint-weighted success rate
Personalized recommendations
Encouragement messages

The system uses submission history stored in MongoDB to generate these insights.

Complexity Simulator

Codexa AI includes an interactive algorithm complexity simulator for both Java and Python.

Students can enter code and watch the system analyze its complexity step by step.

Time Complexity Analysis

The simulator identifies constructs such as:

Sequential statements
Loops
Nested loops
Logarithmic loops
Recursive calls
Mixed complexity patterns

It progressively builds the complexity calculation and produces the final Big-O result.

Supported evaluated complexity classes include:

O(1)
O(n)
O(n²)
O(n³)
O(log n)
O(n log n)
O(n² log n)

The simulator also provides contextual explanations during playback.

Space Complexity Analysis

The simulator can also visualize space usage.

It tracks:

Stack frames
Heap allocations
Arrays
Objects
Recursive stack growth
Variable allocations
Overall memory growth

Students can move through the simulation using playback controls such as:

Play
Pause
Step forward
Step backward
Playback speed control
AST-Based Code Analysis

The complexity simulator uses Tree-sitter to convert Java and Python source code into a structured Abstract Syntax Tree.

The backend extracts constructs such as:

Functions
Loops
Conditions
Variables
Assignments
Function calls

The AST is then transformed into a language-independent representation that can be consumed by the frontend simulation engine.

Java Practice Environment

The Practice workspace provides an IDE-like environment using the Monaco Editor.

Students can:

Select programming problems
Write Java code
Run code
Submit solutions
View compiler and runtime output
Receive progressive hints
Reset starter code
Use fullscreen editor mode
Track hint usage
Submit feedback on hint quality

The platform includes structured Java programming problems across topics such as:

Java Basics
Conditions
Loops
Arrays

Problems are organized across multiple difficulty levels:

Easy
Medium
Hard
Structured Java Study Module

Codexa AI includes a structured Java study module containing 31 chapters.

The curriculum progresses from Java fundamentals toward more advanced concepts.

Study features include:

Chapter navigation
Structured explanations
Java code examples
Runnable code snippets
Chapter quizzes
Progress tracking
Previous and Next navigation
Practice-topic integration

Study code examples can be executed through a lightweight execution endpoint without affecting the student's main submission analytics.

Code Execution Video Generation

Codexa AI includes a video generation workflow for visualizing Java code execution.

Students can:

Write Java code.
Execute and validate the program.
Generate an animated visualization.
Track rendering progress.
Play the generated video inside the application.

The video rendering pipeline integrates with an external Manim-based rendering service.

Supported rendering quality options include:

480p
720p
1080p
1440p
System Architecture
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
Technology Stack
Frontend
React 19
Vite 8
JavaScript / JSX
Monaco Editor
Zustand
Recharts
Framer Motion
Tailwind CSS
Axios
Backend
Python 3.10+
Flask
Flask-CORS
PyMongo
Tree-sitter
Tree-sitter Java
Tree-sitter Python
Java subprocess execution
REST APIs
Database
MongoDB
MongoDB Atlas or local MongoDB instance
AI Integration
Qwen3 Coder 480B-A35B
RouteLLM API
OpenAI-compatible inference interface
Visualization
Recharts
Custom React simulation engine
Monaco Editor line highlighting
Manim-based rendering service
Evaluation Results

The system was evaluated across its major AI and analysis components using dedicated evaluation datasets.

AI Hint Quality Evaluation

Evaluation Samples: 30

Metric	Score
Overall Hint Quality	89.11%
Relevance	82.78%
Completeness	93.33%
Specificity	93.33%
No-Full-Solution Compliance	100%

The evaluation covered multiple Java error categories including:

Syntax errors
Type errors
Symbol errors
NullPointerException
ArrayIndexOutOfBoundsException
StackOverflow
ArithmeticException
ClassCastException
StringIndexOutOfBoundsException
NumberFormatException
Logic errors
Scope errors
Access errors

The no-full-solution policy achieved 100% compliance in the evaluation set.

Hallucination Guard Evaluation

Evaluation Samples: 30

Metric	Result
Overall Accuracy	100%
True Positive Rate	100%
True Negative Rate	100%
False Positives	0
False Negatives	0

The evaluation included validation scenarios such as:

Valid responses
Missing required keys
Empty required fields
Markdown code fences
Full-solution leakage
Invalid field types

The hallucination guard correctly classified all evaluated cases.

Time Complexity Analyzer Evaluation

Evaluation Samples: 30

Metric	Result
Overall Accuracy	96.67%
Correct Predictions	29 / 30
Accuracy by Complexity Class
Complexity	Accuracy
O(1)	100%
O(n)	100%
O(n²)	100%
O(n³)	100%
O(log n)	75%
O(n log n)	100%
O(n² log n)	100%

The evaluation demonstrates strong performance across constant, linear, quadratic, cubic, logarithmic, and mixed complexity patterns.

API Overview

The Flask backend exposes REST endpoints including:

GET  /api/health

POST /api/submit-code

POST /api/execute-code

POST /api/request-hint

POST /api/parse-ast

POST /api/feedback

GET  /api/learning-summary/<user_id>

GET  /api/study/topic/<chapter_id>

All backend responses use a unified response structure.

Example:

{
  "success": true,
  "data": {},
  "error": null
}
Project Structure
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
│   │
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
│
└── README.md
Installation and Setup
Prerequisites

Install the following before running the project:

Python 3.10+
Node.js
npm
Java JDK
MongoDB or MongoDB Atlas access
Git
Clone the Repository
git clone https://github.com/amulya6904/AI-Code-Explainer.git
cd AI-Code-Explainer
Backend Setup

Navigate to the backend directory:

cd backend

Create a Python virtual environment.

Windows
python -m venv venv
venv\Scripts\activate
Linux / macOS
python3 -m venv venv
source venv/bin/activate

Install the backend dependencies:

pip install -r requirements.txt

Create a .env file and configure the required environment variables for:

MongoDB
RouteLLM / LLM access
Any environment-specific backend configuration

Start the backend:

python app.py

The backend runs locally on:

http://localhost:5000
Frontend Setup

Open another terminal.

Navigate to:

cd frontend

Install frontend dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend will start using the local Vite development server.

Learning Analytics Model

Codexa AI uses hint-weighted success scoring instead of treating every successful submission equally.

A successful submission receives credit based on how much hint assistance was required.

0 hints  -> 1.0
1 hint   -> 0.7
2 hints  -> 0.4
3 hints  -> 0.1
4+ hints -> 0.0

This makes the success metric more representative of independent problem-solving ability.

Topic Status Classification

The platform analyzes learning performance over time and can classify topics into learning states such as:

WEAK
IMPROVING
STRONG
NEUTRAL

These states help the system provide more meaningful learning analytics and encouragement.

Hint Feedback

Students can rate generated hints using helpful or not-helpful feedback controls.

The feedback is associated with the originating submission and stored for future evaluation.

This makes it possible to compare:

Automated Confidence Score
            vs
Human Hint Feedback

and eventually improve confidence-score calibration.

Reliability and Safety

The AI subsystem is wrapped with deterministic validation and fallback mechanisms.

If the primary LLM response fails, the application can continue through:

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

This design helps keep the tutoring experience available even if the model fails or returns an invalid output.

Academic Integrity

Codexa AI is intentionally designed to support learning rather than replace it.

The platform:

Avoids complete corrected programs.
Restricts generated code guidance.
Reveals hints progressively.
Encourages self-correction.
Validates AI-generated responses.
Tracks hint assistance.
Promotes conceptual understanding.

The platform is therefore designed as an educational tutor rather than an automated solution generator.

Design Philosophy

The frontend is designed as a dark-themed, IDE-inspired learning environment.

The interface prioritizes:

Readability
Clear coding workflows
Minimal distraction
Responsive design
Interactive feedback
Progressive learning
Visual explanation of complexity concepts
Future Scope

Potential extensions include:

Additional programming languages
More advanced DSA topics
Retrieval-Augmented Generation for learning resources
Personalized learning-path generation
Instructor dashboards
Classroom-level analytics
Adaptive question recommendation
Expanded complexity analysis
Larger automated evaluation datasets
Cloud deployment
Collaborative learning features
Real-time instructor feedback
AI-assisted curriculum recommendation
Documentation

Detailed technical documentation is available inside the repository.

backend/README.md

frontend/README.md

README_manim_video.md

The backend documentation contains detailed information about:

API architecture
Java execution engine
LLM integration
Hallucination guard
Fallback mechanisms
Confidence scoring
MongoDB architecture
Learning analytics

The frontend documentation contains detailed information about:

React architecture
Practice workspace
Dashboard
Progress analytics
Complexity simulator
Study module
Video generation
State management
Design system
Evaluation Artifacts

Evaluation scripts and result files are available in the evaluation/ directory.

These include:

hint_accuracy_eval.py
hint_eval_results.json

hallucination_guard_eval.py
hallucination_guard_results.json

time_complexity_eval.py
time_complexity_eval_v2.py
time_complexity_results_v2.json

These artifacts are included to make the reported evaluation metrics reproducible and transparent.

Project Philosophy

Don't give the learner the answer. Give them enough guidance to discover it.

Codexa AI aims to transform debugging from a frustrating trial-and-error process into a structured, measurable, and adaptive learning experience.

Author

Amulya

Computer Science Engineering

Repository
https://github.com/amulya6904/AI-Code-Explainer
License

This project is intended for educational and research purposes.


One thing before committing: if your `main` branch has not yet received the `develop` merge, update the README **after
