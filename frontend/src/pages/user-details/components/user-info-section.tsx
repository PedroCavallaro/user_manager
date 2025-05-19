import type { ReactNode } from 'react';
import { Button } from '../../../components/button/button';

function UserInfoSection({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col border border-white/20 rounded-lg">
      <div className="p-4 flex-col flex gap-4 justify-start">{children}</div>
    </div>
  );
}

const Save = ({
  disabled,
  loading,
  onSave,
}: {
  disabled?: boolean;
  onSave?: (params: unknown) => void;
  loading?: boolean;
}) => {
  return (
    <div
      className="border-t pt-3 border-white/20 flex items-end justify-end
      jusw-full"
    >
      <div className="flex w-24">
        <Button
          isLoading={loading}
          onClick={onSave}
          disabled={disabled}
          variant="secondary"
        >
          <Button.Title>Salvar</Button.Title>
        </Button>
      </div>
    </div>
  );
};

UserInfoSection.Save = Save;

export { UserInfoSection };
