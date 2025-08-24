'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

export default function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
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
        // Chame a função do componente pai para atualizar a lista
        if (onTaskAdded) {
          onTaskAdded();
        }
      }

    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      setMessage('Erro ao adicionar tarefa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Adicionar Nova Tarefa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ex: Criar a página de login"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
        </button>
        {message && (
          <div className={`text-center text-sm mt-2 ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}