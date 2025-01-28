'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from '../ui/Input';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const { register: registerUser, error, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    return () => {
      useAuthStore.setState({ error: null });
    };
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    useAuthStore.setState({ error: null });
    
    await registerUser(values.email, values.password, values.name);
    if (!error) {
      router.push("/");
    } else {
      form.reset({ 
        name: values.name,
        email: values.email,
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="mt-8 space-y-6 rounded-lg bg-card p-6 shadow-lg border border-border animate-in fade-in-50"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Icons.user className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      autoComplete="name"
                    />
                  </div>
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
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Icons.mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
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
                    <Icons.lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      className="pl-10"
                      autoComplete="new-password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Icons.lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      className="pl-10"
                      autoComplete="new-password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="text-destructive text-sm rounded-md bg-destructive/10 p-2 animate-in fade-in-50">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign up
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href="/auth/signin"
            className="text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}
