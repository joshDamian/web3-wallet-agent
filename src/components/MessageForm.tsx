import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SendTextMessageInput,
  sendTextMessageInputSchema,
} from "~/core/schema/chat-schema";

type MessageFormProps = {
  handleSendMessage: (message: string) => Promise<void>;
};

const MessageForm: React.FC<MessageFormProps> = ({ handleSendMessage }) => {
  const methods = useForm<SendTextMessageInput>({
    resolver: zodResolver(sendTextMessageInputSchema),
    mode: "onSubmit",
  });

  const onSubmit = methods.handleSubmit(async (input) => {
    await handleSendMessage(input.text);
  });

  return <form onSubmit={onSubmit} className={"flex justify-between"}>
    <input {...methods.register('text')} name={'text'} className={'appearance-none outline-none'} /> <button className={''}>Send Message</button>
  </form>;
};

export default MessageForm;
