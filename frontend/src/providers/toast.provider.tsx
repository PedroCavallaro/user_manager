import { createContext, useContext, useState } from 'react';

interface Toast {
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface IToastContext {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<IToastContext>({} as IToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>();

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ message, type });

    setTimeout(() => {
      removeToast();
    }, 2000);
  };

  const removeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2
          md:left-auto md:right-4 md:translate-x-0
          z-50 flex flex-col gap-2 transition-all"
        >
          <div className="p-4 bg-rich-black-100 border border-white/20 rounded-lg shadow-lg text-white animate-slide-in-down">
            {toast?.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
