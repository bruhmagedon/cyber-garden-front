import { LoginForm } from '@/features/auth';
import { AuthScene } from './components/AuthScene';

const LoginPage = () => {
  return (
    <AuthScene title="Вход в Cyber Garden" subtitle="Продолжите работу в космической экосистеме">
      <LoginForm />
    </AuthScene>
  );
};

export default LoginPage;
