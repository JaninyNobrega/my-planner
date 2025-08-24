'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setEmail('');
        setPassword('');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setMessage('Erro ao tentar registrar.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md border border-white/10">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
          Crie sua conta
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-white/70 text-gray-900 border border-gray-300 rounded-xl placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-white/70 text-gray-900 border border-gray-300 rounded-xl placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 font-semibold text-white rounded-xl shadow-md
                       bg-gradient-to-r from-pink-500 to-purple-600
                       hover:shadow-lg hover:scale-[1.02]
                       transition-transform transition-shadow duration-300
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
          >
            Registrar-se
          </button>

          {message && (
            <div className={`text-center text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-700">Já tem uma conta? </span>
          <Link
            href="/auth/login"
            className="font-semibold text-purple-600 hover:text-pink-500 transition-colors duration-200"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
