import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { type CreateAccountDTO, CreateAccountSchema } from '../../../api/dto';
import { Button } from '../../../components/button/button';
import { GoogleButton } from '../../../components/button/google-button';
import { Input } from '../../../components/input/input';
import { useAuth } from '../../../providers/auth.provider';

export function RegisterForm() {
  const { register: createAccount } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: zodResolver(CreateAccountSchema),
  });

  const { isPending: isLoading, mutate: onSubmit } = useMutation({
    mutationFn: (data: CreateAccountDTO) => createAccount(data),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
      className="h-4/5 desktop-layout flex items-center justify-center"
    >
      <div className="w-full md:w-4/12 flex flex-col gap-5 items-center justify-center">
        <h2 className="font-title mb-4 text-white">Cadastro</h2>
        <GoogleButton />
        <div className="w-full h-[1px] bg-zinc-400/40" />
        <div className="flex flex-col w-full gap-3 items-center justify-center ">
          <Input error={errors.name?.message}>
            <Input.Field placeholder="Nome" {...register('name')}></Input.Field>
          </Input>
          <Input error={errors?.email?.message}>
            <Input.Field
              placeholder="Email"
              {...register('email')}
            ></Input.Field>
          </Input>
          <Input error={errors?.password?.message}>
            <Input.Field
              type="password"
              placeholder="Senha"
              {...register('password')}
            ></Input.Field>
          </Input>
        </div>
        <Button variant="secondary" isLoading={isLoading}>
          <Button.Title>Entrar</Button.Title>
        </Button>
      </div>
    </form>
  );
}
