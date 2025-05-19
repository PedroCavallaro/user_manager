import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../api';
import {
  type UpdateUserInfoDTO,
  UpdateUserInfoSchema,
  type User,
} from '../../api/dto';
import { Input } from '../../components/input/input';
import { PasswordInput } from '../../components/input/password-input';
import { useAuth } from '../../providers/auth.provider';
import { tokenService } from '../../services';
import { UserInfoSection } from './components/user-info-section';

export function UserDetails() {
  const { user, setUser } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(UpdateUserInfoSchema),
    mode: 'onBlur',
  });

  const update = useCallback(
    async (updateUserDto: UpdateUserInfoDTO) => {
      const { data, error } = await api.user.updateUserInfo({
        ...updateUserDto,
        password:
          updateUserDto.password === '' ? undefined : updateUserDto.password,
      });

      if (error) return;

      const tokenData = tokenService.safeDecode<User>(data.token);

      if (!tokenData) return;

      tokenService.setTokens(data.token, data.refresh);

      setUser(tokenData);
    },
    [setUser]
  );

  const { isPending, mutate: updateUser } = useMutation({
    mutationFn: (data: UpdateUserInfoDTO) => update(data),
  });

  return (
    <div className="desktop-layout flex flex-col gap-6">
      <div className="flex gap-4 lg:gap-6 border border-white/20 rounded-lg p-4">
        <div className="rounded-lg bg-white flex items-center justify-center lg:h-32 h-20 overflow-hidden w-32">
          {user?.picture ? (
            <img
              src={user?.picture}
              className="w-full h-full object-cover"
              alt="foto de perfil"
            />
          ) : (
            <h2 className="text-2xl font-geist uppercase text-black">
              {user?.name?.[0]}
            </h2>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <p className="font-caption text-white">{user?.name}</p>
          <p className="font-caption text-white/50">{user?.email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit((data) => updateUser(data))}>
        <UserInfoSection>
          <p className="font-body1 text-white ">Nome</p>
          <div className="lg:w-3/6">
            <Input error={errors?.name?.message}>
              <Input.Field
                disabled={isPending}
                placeholder={user?.name}
                {...register('name')}
              ></Input.Field>
            </Input>
          </div>
          <UserInfoSection.Save loading={isPending} />
        </UserInfoSection>
        <UserInfoSection>
          <p className="font-caption text-white">Alterar senha</p>
          <p className="font-caption text-white/80 ">Minímo 8 caracteres.</p>
          <div className="lg:w-3/6">
            <PasswordInput
              disabled={isPending}
              autoComplete="new-password"
              autoCorrect="off"
              {...register('password')}
            />
          </div>
          <UserInfoSection.Save loading={isPending} />
        </UserInfoSection>
      </form>
    </div>
  );
}
