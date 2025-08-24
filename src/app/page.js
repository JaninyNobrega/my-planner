import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 text-center">
      <div className="w-full max-w-lg space-y-8 p-10 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
          Bem-vindo!
        </h1>
        <p className="text-xl text-gray-700">
          Gerencie suas tarefas com estilo e produtividade.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link
            href="/auth/login"
            className="w-full md:w-auto px-8 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            Acessar
          </Link>
          <Link
            href="/auth/register"
            className="w-full md:w-auto px-8 py-3 font-semibold text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            Registrar
          </Link>
        </div>
      </div>
    </div>
  );
}
