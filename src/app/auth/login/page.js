'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        Cookies.set('token', data.token, { expires: 1 });
        setEmail('');
        setPassword('');
        router.push('/dashboard'); 
      }

    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setMessage('Erro ao tentar fazer login.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-100">
          Acesse sua conta
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 text-gray-900 bg-yellow-500 rounded-xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Entrar
          </button>
          {message && (
            <div className={`text-center text-sm ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
          )}
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-500">Não tem uma conta? </span>
          <Link href="/auth/register" className="font-semibold text-red-500 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}