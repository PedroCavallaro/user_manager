import { Menu } from 'lucide-react';
import { useAuth } from '../providers/auth.provider';
import { ProfileImage } from './profile-image';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full p-4 lg:px-16 lg:py-6 flex items-center justify-between border-b border-white/20">
      <ProfileImage name={user?.name ?? ''} image={user?.picture} />
      <p className="lg:text-2xl text-white">
        <Menu />
      </p>
    </header>
  );
}
