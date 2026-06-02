import ChatBubble from "./ChatBubble";
import type { ChatMessage } from "../types/chat";

type ChatMessagesProps = {
  messages: ChatMessage[];
};

function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-3">
      {messages.map((message, index) => (
        <ChatBubble key={`${message.role}-${index}`} message={message} />
      ))}
    </div>
  );
}

export default ChatMessages;
