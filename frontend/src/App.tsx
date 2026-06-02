import { useState } from "react";
import type { FormEvent } from "react";
import ChatForm from "./components/ChatForm";
import ChatMessages from "./components/ChatMessages";
import StatusMessage from "./components/StatusMessage";
import type { ChatMessage, ChatResponse } from "./types/chat";

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  onRetry?: (attempt: number, totalAttempts: number) => void,
): Promise<Response> {
  let lastError: unknown;
  const totalAttempts = retries + 1;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      lastError = new Error(`Backend returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      onRetry?.(attempt + 2, totalAttempts);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [started, setStarted] = useState(false);

  async function sendPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentPrompt = prompt.trim();

    if (!currentPrompt || loading) {
      return;
    }

    const requestMessages = messages;
    const userMessage: ChatMessage = { role: "user", text: currentPrompt };

    setMessages([...requestMessages, userMessage]);
    setPrompt("");
    setError("");
    setStatus("Waiting for response...");
    setLoading(true);

    try {
      const res = await fetchWithRetry(
        "http://127.0.0.1:8000/prompt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary,
            messages: requestMessages,
            prompt: currentPrompt,
          }),
        },
        3,
        (attempt, totalAttempts) => {
          setStatus(`Retrying... attempt ${attempt} of ${totalAttempts}`);
        },
      );

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

      const data = (await res.json()) as ChatResponse;

      if (!Array.isArray(data.messages)) {
        throw new Error("Backend response did not include messages");
      }

      setMessages(data.messages);
      setSummary(data.summary);
      setStarted(true);
      setStatus("");
    } catch (error) {
      setError(
        error instanceof Error
          ? `Request failed after retries: ${error.message}`
          : "Request failed after retries",
      );
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4">
        <StatusMessage status={status} error={error} />

        <ChatMessages messages={messages} />
        {!started && <h1 className="text-2xl font-bold text-slate-900">Send a Prompt</h1>}
        <ChatForm
          prompt={prompt}
          loading={loading}
          onPromptChange={setPrompt}
          onSubmit={sendPrompt}
        />
      </section>
    </main>
  );
}

export default App;
