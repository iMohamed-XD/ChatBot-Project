export type ChatRole = "user" | "model";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

export type ChatResponse = {
  messages: ChatMessage[];
  summary: string;
};
