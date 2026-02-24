import React, { useState, useEffect, useRef } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { Message } from "@/utils/type";

interface FnHandler {
  messages: Message[];
  handleSubmit: (data: Message) => void;
  currentUserId: string;
}

interface MessageCardProps {
  message: string;
  isCurrentUser: boolean;
}

export default function Chat({
  messages,
  handleSubmit,
  currentUserId,
}: FnHandler) {
  const colors = useColors();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const onSubmit = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      author: currentUserId,
      message: input,
      timestamp: `${new Date()}`,
    };

    handleSubmit(newMessage);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full p-4 gap-4">
      <div
        className={`flex-1 rounded-2xl p-4 overflow-y-auto ${colors.background.primary} ${colors.border.fadedThin}`}
      >
        {messages.map((msg, index) => (
          <MessageCard
            key={index}
            message={msg.message}
            isCurrentUser={msg.author === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className={`rounded-xl px-4 py-3 ${colors.background.primary} ${colors.border.fadedThin}`}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

export function MessageCard({ message, isCurrentUser }: MessageCardProps) {
  const theme = useColors();
  return (
    <div
      className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          isCurrentUser
            ? `${theme.background.heroPrimary} ${theme.text.inverted} ${theme.border.defaultThin} rounded-br-none`
            : `${theme.background.secondary} ${theme.text.primary} ${theme.border.defaultThin} rounded-br-none`
        }`}
      >
        {message}
      </div>
    </div>
  );
}
