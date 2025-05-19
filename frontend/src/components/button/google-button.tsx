import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import googleLogo from '../../assets/google_logo.png';
import { useAuth } from '../../providers/auth.provider';
import { Button } from './button';

export function GoogleButton() {
  const { socialLogin } = useAuth();

  const { isPending: isLoading, mutate: onLogin } = useMutation({
    mutationFn: (token: string) => socialLogin(token),
  });

  const login = useGoogleLogin({
    onSuccess: (token) => onLogin(token.access_token),
  });

  return (
    <Button
      type="button"
      isLoading={isLoading}
      onClick={() => login()}
      variant="secondary"
    >
      <img src={googleLogo} alt="login com google" width={30} height={30} />
      <Button.Title>Continuar com o google</Button.Title>
    </Button>
  );
}
