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
        headers: { 'Content-Type': 'application/json' },
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
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary via-accent to-secondary">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 bg-white/10 rounded-3xl shadow-2xl backdrop-blur-md border border-white/10">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-wide">
          Acesse sua conta
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-white/5 text-foreground border border-white/10 rounded-xl placeholder:text-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-accent/70 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground/80">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 bg-white/5 text-foreground border border-white/10 rounded-xl placeholder:text-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-accent/70 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full px-6 py-3 font-semibold text-white rounded-xl shadow-lg
                       bg-gradient-to-r from-accent via-primary to-secondary
                       hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                       transition-transform transition-shadow duration-300
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background text-sm sm:text-base"
          >
            Entrar
          </button>
        </form>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`text-center text-sm ${message.includes('sucesso') ? 'text-success' : 'text-accent'}`}>
            {message}
          </div>
        )}

        {/* Link para cadastro */}
        <div className="text-center text-xs sm:text-sm">
          <span className="text-foreground/70">Não tem uma conta? </span>
          <Link
            href="/auth/register"
            className="font-semibold text-info hover:text-primary transition-colors duration-200"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
