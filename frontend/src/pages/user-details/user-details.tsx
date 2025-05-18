import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../api";
import { type UpdateUserInfoDTO, UpdateUserInfoSchema } from "../../api/dto";
import { Input } from "../../components/input/input";
import { PasswordInput } from "../../components/input/password-input";
import { useAuth } from "../../providers/auth.provider";
import { UserInfoSection } from "./components/user-info-section";

export function UserDetails() {
	const { user, refresh } = useAuth();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: zodResolver(UpdateUserInfoSchema),
		mode: "onBlur",
	});

	const update = useCallback(
		async (data: UpdateUserInfoDTO) => {
			const res = await api.user.updateUserInfo(data);

			await refresh();
		},
		[refresh],
	);

	const { isPending, mutate: updateUser } = useMutation({
		mutationFn: (data: UpdateUserInfoDTO) => update(data),
	});

	return (
		<div className="desktop-layout flex flex-col gap-6">
			<div className="flex gap-4 lg:gap-6 border border-white/20 rounded-lg p-4">
				<div className=" py-1 rounded-lg bg-white flex items-center justify-center lg:h-32 lg:w-32 h-24 w-24" />
				<div className="flex flex-col gap-2 items-start">
					<p className="font-caption text-white">{user?.name}</p>
					<p className="font-caption text-white/50">{user?.email}</p>
				</div>
			</div>
			<form onSubmit={handleSubmit((data) => updateUser(data))}>
				<UserInfoSection>
					<p className="font-body1 text-white ">Nome</p>
					<div className="lg:w-3/6">
						<Input>
							<Input.Field
								placeholder={user?.name}
								{...register("name")}
							></Input.Field>
						</Input>
					</div>
					<UserInfoSection.Save />
				</UserInfoSection>
				<UserInfoSection>
					<p className="font-caption text-white">Alterar senha</p>
					<p className="font-caption text-white/80 ">Minímo 8 caracteres.</p>
					<PasswordInput
						autoComplete="new-password"
						autoCorrect="off"
						{...register("password")}
					/>
					<UserInfoSection.Save disabled={true} />
				</UserInfoSection>
			</form>
		</div>
	);
}
