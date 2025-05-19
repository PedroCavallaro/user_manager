import clsx from 'clsx';
import {
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

type Variants = 'primary' | 'secondary' | 'no-border';

type InputProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  error?: string;
  variant?: Variants;
};

function Input({ children, variant = 'primary', error, ...rest }: InputProps) {
  return (
    <div className="w-full flex flex-col">
      <div
        className={clsx(
          'h-12 w-full flex flex-row items-center justify-center gap-2 rounded-lg px-2',
          {
            'border-[1px] border-zinc-200/20': variant === 'primary',
            'bg-black': variant === 'secondary',
          }
        )}
        {...rest}
      >
        {children}
      </div>
      {error && <span className="text-red-500 font-geist">{error}</span>}
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement>;

const Field = forwardRef<HTMLInputElement, FieldProps>(({ ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className="flex-1 placeholder:text-white/40 font-caption text-white bg-transparent outline-none"
      {...rest}
    />
  );
});
Input.Field = Field;

export { Input };
