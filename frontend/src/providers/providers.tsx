import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from '../lib';
import { AuthProvider } from './auth.provider';
import { ToastProvider } from './toast.provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
