import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-600 to-gray-900 font-sans text-center">
      <div className="w-full max-w-lg space-y-8 p-8 bg-white rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Bem-vindo!
        </h1>
        <p className="text-xl text-gray-600">
          Seu aplicativo de gerenciamento de tarefas está pronto.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/auth/login" className="w-full md:w-auto px-8 py-3 font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors duration-200">
            Acessar
          </Link>
          <Link href="/auth/register" className="w-full md:w-auto px-8 py-3 font-semibold text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-colors duration-200">
            Registrar
          </Link>
        </div>
      </div>
    </div>
  );
}