import { z } from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(2).max(20),
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().max(50),
});

export const loginSchema = z.object({
    username: z.string().min(2).max(20),
    password: z.string().min(6),
})