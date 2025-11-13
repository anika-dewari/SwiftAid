'use client';

import { SwiftAidLoginForm } from '@/components/ui/swiftaid-loginform';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <SwiftAidLoginForm 
      onSignUpClick={() => router.push('/auth/register')}
    />
  );
}
