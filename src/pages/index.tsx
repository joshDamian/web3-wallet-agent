import Head from "next/head";

import { api } from "~/utils/api";
import ChatInterface from "~/components/ChatInterface";
import React from "react";

export default function Home() {
  const [messages, setMessages] = React.useState<
    Array<{
      content: string;
      role: "user" | "assistant";
    }>
  >([]);

  const handleSendMessage = async (message: string) => {
    // Todo: Implement sending message
  };

  return (
    <>
      <Head>
        <title>Web3 Wallet Agent</title>
        <meta name="description" content="Wallet agent" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <ChatInterface
          handleSendMessage={handleSendMessage}
          messages={messages}
        />
      </main>
    </>
  );
}
