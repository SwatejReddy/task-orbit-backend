import { strict } from 'assert';
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

export const taskSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().max(1000).optional(),
    status: z.enum(['To Do', 'In Progress', 'Completed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    dueDate: z.string(),
})