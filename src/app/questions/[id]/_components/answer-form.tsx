'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addAnswerAction } from '../actions';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  answer: z.string().min(20, 'Answer must be at least 20 characters long.'),
});

type FormData = z.infer<typeof formSchema>;

interface AnswerFormProps {
  questionId: string;
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { answer: '' },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: FormData) => {
    try {
        const result = await addAnswerAction({
            questionId,
            content: data.answer,
        });

        if (result.success) {
            toast({
                title: 'Answer Posted!',
                description: 'Your answer has been successfully submitted.',
            });
            form.reset();
            router.refresh(); // Refresh the page to show the new answer
        } else {
             toast({
                variant: 'destructive',
                title: 'Submission failed',
                description: result.error,
            });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: 'Could not submit your answer. Please try again.',
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline font-bold">Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={form.control}
            name="answer"
            render={({ field, fieldState }) => (
              <div>
                <RichTextEditor value={field.value} onChange={field.onChange} />
                {fieldState.error && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Button type="submit" size="lg" disabled={isSubmitting}>
            Post Your Answer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
