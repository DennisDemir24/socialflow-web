"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import { Input } from "../ui/Input";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function SignInForm() {
  const { login, error, loading } = useAuthStore();
  const router = useRouter();

  // Add error cleanup effect
  React.useEffect(() => {
    return () => {
      // Clear error state when component unmounts
      useAuthStore.setState({ error: null });
    };
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormData) => {
    // Clear any previous errors
    useAuthStore.setState({ error: null });
    
    await login(values.email, values.password);
    if (!error) {
      router.push("/");
    } else {
      // Reset form fields on error
      form.reset({ 
        email: values.email, // Keep email for user convenience
        password: "", // Clear password
        rememberMe: values.rememberMe 
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
                      autoComplete="current-password"
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

        <div className="flex items-center justify-between">
         {/*  <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          /> */}

          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground">
            Don't have an account?{" "}
          </span>
          <Link
            href="/auth/signup"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
