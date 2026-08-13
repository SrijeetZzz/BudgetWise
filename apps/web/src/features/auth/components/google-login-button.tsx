'use client';

import { GoogleLogin } from '@react-oauth/google';

import { useGoogleLogin } from '../hooks/use-google-login';

export function GoogleLoginButton() {
  const googleLogin = useGoogleLogin();

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const idToken = credentialResponse.credential;

          if (!idToken) {
            return;
          }

          googleLogin.mutate(idToken);
        }}
        onError={() => {
          // The hook handles API errors.
        }}
        useOneTap={false}
        width="100%"
      />
    </div>
  );
}