'use server';

import { suggestTags, type SuggestTagsInput, type SuggestTagsOutput } from '@/ai/flows/suggest-tags';

export async function suggestTagsAction(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  // Here you could add validation, authentication, or rate limiting
  return await suggestTags(input);
}
