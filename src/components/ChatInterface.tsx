import React from "react";
import MessageForm from "~/components/MessageForm";
import { twMerge } from "tailwind-merge";

type ChatInterfaceProps = {
  handleSendMessage: (message: string) => Promise<void>;
  messages: Array<{
    content: string;
    role: "user" | "assistant";
  }>;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  handleSendMessage,
  messages,
}) => {
  return (
    <div className={"flex flex-col gap-8"}>
      <section className={"flex flex-col gap-4"}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={twMerge(
              "w-[280px] rounded-md p-5",
              message.role === "user"
                ? "self-end bg-blue-100"
                : "self-start bg-green-100",
            )}
          >
            {message.content}
          </div>
        ))}
      </section>
      <MessageForm handleSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
