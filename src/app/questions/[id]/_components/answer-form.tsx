'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  answer: z.string().min(20, 'Answer must be at least 20 characters long.'),
});

type FormData = z.infer<typeof formSchema>;

export function AnswerForm() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { answer: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast({
      title: 'Answer Posted!',
      description: 'Your answer has been successfully submitted.',
    });
    form.reset();
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
          <Button type="submit" size="lg">
            Post Your Answer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
