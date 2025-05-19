import { Link } from 'react-router-dom';
import { ROUTES } from '../../App';
import { LoginForm } from './components/login-form';

export function Login() {
  return (
    <main className="bg-black h-dvh">
      <LoginForm />
      <div className="w-full p-2 md:p-8 absolute bottom-0 border-t-[0.4px] border-zinc-400/40">
        <h2 className="font-caption p-2 text-center text-blue-500">
          <Link to={ROUTES.register}>Não tem uma conta? Cadastre-se</Link>
        </h2>
      </div>
    </main>
  );
}
