import type { ReactNode } from "react";
import { Button } from "../../../components/button";

function UserInfoSection({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col border border-white/20 rounded-lg">
			<div className="p-4 flex-col flex gap-4 justify-start">{children}</div>
		</div>
	);
}

const Save = ({
	disabled,
	onSave,
}: { disabled?: boolean; onSave?: (params: unknown) => void }) => {
	return (
		<div className="border-t pt-3 border-white/20 items-end w-full justify-end">
			<div className="flex w-full items-end justify-end">
				<Button
					onClick={onSave}
					disabled={disabled}
					variant="secondary"
					className="w-24 h-10"
				>
					<Button.Title>Salvar</Button.Title>
				</Button>
			</div>
		</div>
	);
};

UserInfoSection.Save = Save;

export { UserInfoSection };
