import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z]*$/, "Username must not contain special characters or numbers");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: "Please enter a valid email"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})

