import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../App";
import { api } from "../../../api";
import { CreateAccountSchema, type LoginDTO } from "../../../api/dto";
import googleLogo from "../../../assets/google_logo.png";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input/input";

export function RegisterForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		resolver: zodResolver(CreateAccountSchema),
	});

	const login = useCallback(async (data: LoginDTO) => {
		const res = await api.auth.login(data);

		navigate(ROUTES.register);
	}, []);

	const { isPending: isLoading, mutate: onSubmit } = useMutation({
		mutationFn: (data: LoginDTO) => login(data),
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
				<Button variant="secondary">
					<img src={googleLogo} alt="login com google" width={30} height={30} />
					<Button.Title>Continuar com o google</Button.Title>
				</Button>
				<div className="w-full h-[1px] bg-zinc-400/40" />
				<div className="flex flex-col w-full gap-3 items-center justify-center ">
					<Input>
						<Input.Field placeholder="Nome" {...register("name")}></Input.Field>
					</Input>
					<Input>
						<Input.Field
							placeholder="Email"
							{...register("email")}
						></Input.Field>
					</Input>
					<Input>
						<Input.Field
							type="password"
							placeholder="Senha"
							{...register("password")}
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
