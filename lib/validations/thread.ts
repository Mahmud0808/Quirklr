import * as z from "zod";

export const ThreadValidationSchema = z.object({
  thread: z
    .string()
    .min(3, { message: "Thread must be at least 3 characters long" }),
  accountId: z.string(),
});

export const CommentValidationSchema = z.object({
  thread: z
    .string()
    .min(3, { message: "Comment must be at least 3 characters long" }),
});
