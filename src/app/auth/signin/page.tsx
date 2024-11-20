'use client';

import { AuthCard } from '@/components/auth/AuthCard';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in to SocialFlow"
      description="Manage your social media content with ease"
    >
      <SignInForm />
    </AuthCard>
  );
}
