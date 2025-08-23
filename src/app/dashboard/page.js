import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  // Se não houver token, redireciona para a página de login
  if (!token) {
    redirect('/auth/login');
  }

  try {
    // 1. Verifique o token usando a sua chave secreta
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    
    // 2. Se a verificação for bem-sucedida, o usuário está autenticado
    
    const userEmail = decodedToken.email;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Bem-vindo ao seu painel, **{userEmail}**.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Aqui você pode gerenciar seus projetos e tarefas.
        </p>
      </div>
    );

  } catch (error) {
    // (token inválido ou expirado), redireciona
    console.error('Falha na autenticação do token:', error);
    redirect('/auth/login');
  }
}