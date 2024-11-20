'use client';

import { AuthCard } from '@/components/auth/AuthCard';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Start managing your social media content today"
    >
      <SignUpForm />
    </AuthCard>
  );
}
