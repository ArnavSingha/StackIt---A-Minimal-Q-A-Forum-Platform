
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { LoaderCircle, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signupAction } from '@/app/actions/auth';
import Link from 'next/link';

const formSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email.'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter.')
      .regex(/\d/, 'Must contain at least one digit.')
      .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

const PasswordRequirement = ({ text, met }: { text: string; met: boolean }) => (
    <div className={cn("flex items-center text-sm", met ? "text-green-600" : "text-muted-foreground")}>
        {met ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
        <span>{text}</span>
    </div>
);

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const { isSubmitting } = form.formState;
  const { password, confirmPassword } = form.watch();

  const passwordRequirements = [
      { text: 'At least 8 characters long', met: (password || '').length >= 8 },
      { text: 'Contains a lowercase letter', met: /[a-z]/.test(password) },
      { text: 'Contains an uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'Contains a number', met: /\d/.test(password) },
      { text: 'Contains a special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await signupAction(data);
      if (result.success) {
        toast({
          title: 'Account created!',
          description: 'You have been logged in successfully.',
        });
        router.push('/');
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign up failed',
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not create account. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g. you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Choose a secure password"
                        {...field}
                      />
                       <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {password && !allRequirementsMet && (
              <div className="space-y-1 p-4 bg-muted rounded-lg">
                  {passwordRequirements.map((req, index) => (
                      <PasswordRequirement key={index} text={req.text} met={req.met} />
                  ))}
              </div>
            )}
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        {...field}
                      />
                       <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {confirmPassword && password !== confirmPassword && (
                <div className="flex items-center text-sm text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>Passwords do not match.</span>
                </div>
            )}
          </CardContent>
          <CardFooter className="p-6 pt-0">
             <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </CardFooter>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
                Log in
            </Link>
        </p>
      </form>
    </Form>
  );
}
