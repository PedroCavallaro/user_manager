import { useMemo } from "react";

interface ProfileImageProps {
	image?: string;
	name?: string;
	className?: string;
}

export function ProfileImage({ image, name, className }: ProfileImageProps) {
	const profilePic = useMemo(() => {
		if (image) {
			<img src={image} alt="imagem de perfil" />;
		}

		return (
			<h2 className="font-geist text-lg text-black  uppercase">{name?.[0]}</h2>
		);
	}, [image, name]);

	return (
		<div className="flex gap-4">
			<div
				className={`w-10 py-1 rounded-lg bg-white flex items-center justify-center ${className}`}
			>
				{profilePic}
			</div>
			{name && <h2 className="font-body">{name}</h2>}
		</div>
	);
}
