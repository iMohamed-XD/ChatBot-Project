import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types/chat";

type ChatBubbleProps = {
  message: ChatMessage;
};

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-lg bg-blue-600 p-3 text-white"
            : "max-w-[80%] rounded-lg bg-slate-200 p-3 text-slate-900"
        }
      >
        <p
          className={
            isUser
              ? "mb-1 text-sm font-semibold text-blue-100"
              : "mb-1 text-sm font-semibold text-slate-600"
          }
        >
          {isUser ? "You" : "Gemini"}
        </p>

        <div
          className={
            isUser
              ? "prose prose-invert max-w-none"
              : "prose prose-slate max-w-none"
          }
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
