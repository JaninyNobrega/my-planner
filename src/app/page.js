import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900">
          Bem-vindo ao seu Gerenciador de Tarefas
        </h1>
        <p className="text-gray-600 mt-4">
          Organize seus projetos e tarefas de forma simples e eficiente.
        </p>
        <div className="flex flex-col space-y-4 mt-6">
          <Link href="/auth/login" passHref>
            <button className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Entrar
            </button>
          </Link>
          <Link href="/auth/register" passHref>
            <button className="w-full px-6 py-3 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Registrar-se
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}