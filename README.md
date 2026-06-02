# ChatBot Project

A simple chatbot project with a FastAPI backend and a React frontend.

The frontend sends chat messages to the backend. The backend sends the user's prompt and recent conversation context to Gemini, receives the model response, and returns the updated chat back to the frontend.

## Tech Stack

- Backend: FastAPI
- AI model: Gemini API through `google-genai`
- Frontend: React with Vite
- Styling: Tailwind CSS
- Markdown rendering: `react-markdown`

## Project Structure

```text
.
├── main.py
├── requirements.txt
├── .env
├── .gitignore
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        └── index.css
```

## What The App Does

1. The user types a message in the React frontend.
2. React sends a `POST` request to the FastAPI backend.
3. FastAPI sends the prompt plus conversation context to Gemini.
4. Gemini returns a response.
5. FastAPI returns the updated messages and summary to React.
6. React displays the conversation.

The backend keeps the conversation efficient by keeping only the most recent messages and summarizing older messages when the chat gets long.

## Requirements

Install these before setting up the project:

- Python 3.12 or newer
- Node.js and npm
- A Gemini API key

You can create a Gemini API key from Google AI Studio:

```text
https://aistudio.google.com/app/apikey
```

## Backend Setup

From the project root, create a virtual environment:

```powershell
python -m venv .venv
```

Install backend dependencies:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Do not commit `.env` to GitHub. It contains your private API key.

Run the FastAPI backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI docs are available at:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open a second terminal and go into the frontend folder:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Run the React frontend:

```powershell
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## Running The Full App

You need two terminals.

Terminal 1, backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

Terminal 2, frontend:

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## API Endpoint

The main chat endpoint is:

```text
POST /prompt
```

Example request body:

```json
{
  "summary": "",
  "messages": [
    {
      "role": "user",
      "text": "What is FastAPI?"
    },
    {
      "role": "model",
      "text": "FastAPI is a Python web framework."
    }
  ],
  "prompt": "Explain it more simply."
}
```

Example response body:

```json
{
  "messages": [
    {
      "role": "user",
      "text": "Explain it more simply."
    },
    {
      "role": "model",
      "text": "FastAPI helps you build APIs in Python quickly."
    }
  ],
  "summary": ""
}
```

## Conversation Memory

The app uses two kinds of memory:

- `messages`: recent visible chat messages
- `summary`: a compressed summary of older messages

When the chat grows beyond the recent message limit, the backend summarizes older messages using Gemini and keeps only the latest messages in the frontend.

This avoids sending the entire conversation to Gemini every time.

## Troubleshooting

If `uvicorn` is not recognized, run it through Python:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

If the frontend cannot reach the backend, make sure FastAPI is running at:

```text
http://127.0.0.1:8000
```

If Gemini does not respond, check that `.env` exists and contains:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

If Markdown like `**bold**` appears as plain text, make sure `react-markdown` is installed and used in `App.jsx`.
