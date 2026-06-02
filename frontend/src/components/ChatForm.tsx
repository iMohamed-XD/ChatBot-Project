import type { FormEvent } from "react";

type ChatFormProps = {
  prompt: string;
  loading: boolean;
  onPromptChange: (prompt: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ChatForm({
  prompt,
  loading,
  onPromptChange,
  onSubmit,
}: ChatFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
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
    </form>
  );
}

export default ChatForm;
