'use server';

import { suggestTags, type SuggestTagsInput, type SuggestTagsOutput } from '@/ai/flows/suggest-tags';
import { z } from 'zod';
import { getCurrentUser } from '@/app/actions/auth';
import { createQuestion } from '@/lib/data';

const askQuestionSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  tags: z.array(z.string()).min(1).max(5),
});

export async function suggestTagsAction(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  // Here you could add validation, authentication, or rate limiting
  return await suggestTags(input);
}


export async function askQuestionAction(input: z.infer<typeof askQuestionSchema>) {
    const validation = askQuestionSchema.safeParse(input);
    if (!validation.success) {
        return { success: false, error: 'Invalid input.' };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return { success: false, error: 'You must be logged in to ask a question.' };
    }

    try {
        const questionId = await createQuestion({
            ...validation.data,
            authorId: currentUser.id,
        });
        return { success: true, questionId };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to create question.' };
    }
}
