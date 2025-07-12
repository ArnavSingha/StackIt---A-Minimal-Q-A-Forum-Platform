'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/app/actions/auth';
import { addAnswer, acceptAnswer } from '@/lib/data';

const addAnswerSchema = z.object({
  questionId: z.string(),
  content: z.string().min(20),
});

const acceptAnswerSchema = z.object({
  questionId: z.string(),
  answerId: z.string(),
});

export async function addAnswerAction(input: z.infer<typeof addAnswerSchema>) {
  const validation = addAnswerSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: 'You must be logged in to post an answer.' };
  }

  try {
    await addAnswer(validation.data.questionId, {
      author: currentUser,
      content: validation.data.content,
    });
    
    revalidatePath(`/questions/${validation.data.questionId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add answer.' };
  }
}

export async function acceptAnswerAction(formData: FormData) {
    const rawData = {
        questionId: formData.get('questionId'),
        answerId: formData.get('answerId'),
    };

    const validation = acceptAnswerSchema.safeParse(rawData);
    if (!validation.success) {
        throw new Error('Invalid input.');
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error('You must be logged in.');
    }

    try {
        await acceptAnswer(validation.data.questionId, validation.data.answerId, currentUser.id);
        revalidatePath(`/questions/${validation.data.questionId}`);
    } catch (error: any) {
        // In a real app, you'd want to handle this more gracefully
        // and perhaps return an error to the UI.
        console.error(error.message);
        throw error;
    }
}
