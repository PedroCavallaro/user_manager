import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { type LoginDTO, LoginSchema } from '../../../api/dto';
import { Button } from '../../../components/button/button';
import { GoogleButton } from '../../../components/button/google-button';
import { Input } from '../../../components/input/input';
import { PasswordInput } from '../../../components/input/password-input';
import { useAuth } from '../../../providers/auth.provider';

export function LoginForm() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: zodResolver(LoginSchema),
  });

  const { isPending: isLoading, mutate: onSubmit } = useMutation({
    mutationFn: (data: LoginDTO) => login(data),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
      className="h-4/5  desktop-layout flex items-center justify-center"
    >
      <div className="w-full md:w-4/12 flex flex-col gap-5 items-center justify-center">
        <h2 className="font-title mb-4 text-white">Login</h2>
        <GoogleButton />
        <div className="w-full h-[1px] bg-zinc-400/40" />
        <div className="flex flex-col w-full gap-3 items-center justify-center ">
          <Input error={errors?.email?.message}>
            <Input.Field
              placeholder="Email"
              {...register('email')}
            ></Input.Field>
          </Input>
          <PasswordInput placeholder="Senha" {...register('password')} />
        </div>
        <Button variant="secondary" isLoading={isLoading}>
          <Button.Title>Entrar</Button.Title>
        </Button>
      </div>
    </form>
  );
}
