'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/rich-text-editor';
import { TagInput } from '@/components/tag-input';
import { suggestTagsAction, askQuestionAction } from '../actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.').max(5, 'You can add up to 5 tags.'),
});

type FormData = z.infer<typeof formSchema>;

export function AskQuestionForm() {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  });

  const { title, description } = form.watch();

  const handleSuggestTags = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestTagsAction({ title, description });
      if (result.tags) {
        const currentTags = form.getValues('tags');
        const newTags = [...new Set([...currentTags, ...result.tags])].slice(0, 5);
        form.setValue('tags', newTags, { shouldValidate: true });
        toast({
          title: 'Tags suggested!',
          description: 'We\'ve added some AI-suggested tags for you.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not suggest tags.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await askQuestionAction(data);
      if (result.success && result.questionId) {
        toast({
          title: 'Question Posted!',
          description: 'Your question has been successfully submitted.',
        });
        router.push(`/questions/${result.questionId}`);
      } else {
         toast({
          variant: 'destructive',
          title: 'Failed to post question',
          description: result.error,
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
        description: 'Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Title</CardTitle>
            <CardDescription>Be specific and imagine you’re asking a question to another person.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g. How to use React context effectively?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Description</CardTitle>
            <CardDescription>
              Include all the information someone would need to answer your question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Tags</CardTitle>
            <CardDescription>
              Add up to 5 tags to describe what your question is about.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="tags"
                      render={({ field: controllerField }) => (
                        <TagInput
                          value={controllerField.value}
                          onChange={controllerField.onChange}
                          maxTags={5}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleSuggestTags}
                disabled={isSuggesting || !title || !description}
              >
                {isSuggesting ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Suggest Tags
              </Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Post Your Question
        </Button>
      </form>
    </Form>
  );
}
