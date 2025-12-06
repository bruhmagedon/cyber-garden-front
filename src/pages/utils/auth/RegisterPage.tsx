import { RegisterForm } from '@/features/auth';
import { AuthScene } from './components/AuthScene';

const RegisterPage = () => {
  return (
    <AuthScene title="Регистрация пилота" subtitle="Создайте аккаунт и присоединитесь к экспедиции">
      <RegisterForm />
    </AuthScene>
  );
};

export default RegisterPage;
