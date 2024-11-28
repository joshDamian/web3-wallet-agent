import { z } from "zod";

export const sendTextMessageInputSchema = z.object({
  text: z.string().refine((value) => value.trim().length > 0, {
    message: "Text message cannot be empty",
  })
});

export type SendTextMessageInput = z.infer<typeof sendTextMessageInputSchema>;