'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

export default function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage('O título da tarefa é obrigatório.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = Cookies.get('token');
      if (!token) {
        setMessage('Você não está autenticado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTitle('');
        if (onTaskAdded) onTaskAdded();
      }

    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      setMessage('Erro ao adicionar tarefa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Adicionar Nova Tarefa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white/80">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Criar a página de login"
            className="mt-1 block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
        </button>
        {message && (
          <div className={`text-center text-sm mt-2 ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
