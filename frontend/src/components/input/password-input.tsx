import { Eye, EyeOff } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { Input } from './input';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<'input'>
>((props, ref) => {
  const [visibility, setVisibility] = useState<'password' | 'text'>('password');

  return (
    <Input>
      <Input.Field {...props} ref={ref} type={visibility} />
      <button
        type="button"
        onClick={() =>
          setVisibility((prev) => (prev === 'password' ? 'text' : 'password'))
        }
      >
        <p className="text-white/80">
          {visibility === 'password' ? <Eye size={20} /> : <EyeOff size={20} />}
        </p>
      </button>
    </Input>
  );
});
