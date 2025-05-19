import clsx from 'clsx';
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
} from 'react';

type Variants = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variants;
  isLoading?: boolean;
  children: ReactNode;
};

interface IButtonContext {
  variant: Variants;
  disabled?: boolean;
}

const ButtonContext = createContext({} as IButtonContext);

function Button({
  children,
  isLoading,
  className = '',
  variant = 'primary',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <ButtonContext.Provider value={{ variant, disabled }}>
      <button
        disabled={isLoading}
        className={clsx(
          `h-12 w-full flex flex-row border border-white/20 items-center justify-center gap-2 rounded-lg transition-all ${className}`,
          {
            'bg-rich-black-100 hover:bg-zinc-600/60 font-caption text-white':
              variant === 'primary' && !disabled,
            'bg-white hover:bg-white/80': variant === 'secondary' && !disabled,
            'opacity-50 cursor-not-allowed': isLoading,
            'bg-zinc-800  border-none cursor-not-allowed': disabled === true,
          }
        )}
        {...rest}
      >
        {isLoading ? (
          <span className="animate-spin w-5 h-5 border-2 border-t-transparent border-black rounded-full" />
        ) : (
          children
        )}
      </button>
    </ButtonContext.Provider>
  );
}

function Title({
  children,
  ...rest
}: { children: ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  const { variant, disabled } = useContext(ButtonContext);

  return (
    <span
      className={clsx('font-caption', {
        'text-white': variant === 'primary',
        'text-black': variant === 'secondary',
        'text-zinc-900': disabled === true,
      })}
      {...rest}
    >
      {children}
    </span>
  );
}

Button.Title = Title;

export { Button };
