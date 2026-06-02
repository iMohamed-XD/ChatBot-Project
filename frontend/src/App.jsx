import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  async function sendPrompt(event) {
    event.preventDefault();

    if (!prompt.trim() || loading) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: summary,
          messages: messages,
          prompt: prompt,
        }),
      });

      const data = await res.json();

      setMessages(data.messages);
      setSummary(data.summary);
      setPrompt("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <form
        onSubmit={sendPrompt}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-slate-900">Send a Prompt</h1>

        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Type your prompt"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="disabled:bg-slate-400 disabled:cursor-not-allowed w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Send"}
        </button>

        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? "rounded bg-blue-100 p-3 text-slate-900"
                  : "rounded bg-slate-100 p-3 text-slate-800"
              }
            >
              <p className="text-sm font-semibold">
                {message.role === "user" ? "You" : "Gemini"}
              </p>
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </form>
    </main>
  );
}

export default App;
