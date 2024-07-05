import * as z from "zod";

export const UserValidationSchema = z.object({
  profile_photo: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .min(1, { message: "URL field is required" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(30, { message: "Name must be at most 30 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" }),
  bio: z
    .string()
    .min(3, { message: "Bio must be at least 3 characters long" })
    .max(1000, { message: "Bio must be at most 1000 characters long" })
});
