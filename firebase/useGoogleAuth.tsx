// firebase/useGoogleAuth.js

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './auth';
import {
  AuthRequest,
  AuthSessionResult,
  TokenResponse,
} from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = (): [
  AuthRequest | null,
  AuthSessionResult | null,
  () => Promise<AuthSessionResult>
] => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '684657359599-90nj2pe4e1k4s08b1njurjbni7f6u92h.apps.googleusercontent.com' // ✅ Use this instead of expoClientId
  });

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === 'success' && response.authentication) {
        const authData = response.authentication as TokenResponse;
        const { idToken } = authData;

        if (!idToken) {
          console.error('❌ No ID token found in response');
          return;
        }

        const credential = GoogleAuthProvider.credential(idToken);

        try {
          await signInWithCredential(auth, credential);
          console.log('✅ Google Sign-In Success');
        } catch (error) {
          console.error('❌ Google Sign-In Error:', error);
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

  return [request, response, promptAsync];
};
