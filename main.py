import os

from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from google.genai import types


class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    text: str


class ChatRequest(BaseModel):
    summary: str = ""
    messages: list[ChatMessage]
    prompt: str


MAX_RECENT_MESSAGES = 10


def summarize_old_messages(
    existing_summary: str, older_messages: list[ChatMessage]
) -> str:
    conversation_text = "\n".join(
        f"{message.role}: {message.text}" for message in older_messages
    )

    summary_prompt = f"""
Existing summary:
{existing_summary}

Older conversation messages:
{conversation_text}

Create a concise summary of the important facts, user preferences, decisions,
and unresolved questions.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=summary_prompt,
    )

    return response.text


def to_gemini_content(message: ChatMessage):
    return types.Content(
        role=message.role,
        parts=[types.Part(text=message.text)],
    )


load_dotenv()

app = FastAPI(title="ChatBot Project API")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "FastAPI is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/prompt")
def send_prompt_to_gemini(request: ChatRequest):
    history = []

    if request.summary:
        history.append(
            types.Content(
                role="user",
                parts=[
                    types.Part(text=f"Conversation summary so far:\n{request.summary}")
                ],
            )
        )

    history.extend(to_gemini_content(message) for message in request.messages)

    chat = client.chats.create(
        model="gemini-2.5-flash",
        history=history,
    )

    formatted_prompt = f"""
    Answer the user clearly.

    Formatting rules:
    - If you use a numbered list, put each item on its own line.
    - Use Markdown formatting.
    - Do not put multiple list items on the same line.

    User prompt:
    {request.prompt}
    """

    response = chat.send_message(formatted_prompt)

    updated_messages = [
        *request.messages,
        ChatMessage(role="user", text=request.prompt),
        ChatMessage(role="model", text=response.text),
    ]

    updated_summary = request.summary

    if len(updated_messages) > MAX_RECENT_MESSAGES:
        older_messages = updated_messages[:-MAX_RECENT_MESSAGES]
        recent_messages = updated_messages[-MAX_RECENT_MESSAGES:]

        updated_summary = summarize_old_messages(
            existing_summary=request.summary,
            older_messages=older_messages,
        )

        updated_messages = recent_messages

    return {
        "messages": updated_messages,
        "summary": updated_summary,
    }
