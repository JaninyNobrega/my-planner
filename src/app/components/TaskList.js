'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Você não está autenticado.');
        setLoading(false);
        return;
      }
      
      const res = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Falha ao buscar as tarefas.');
      }

      const data = await res.json();
      setTasks(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha ao deletar a tarefa.');
      }

      setTasks(tasks.filter(task => task._id !== taskId));
      
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      alert(err.message);
    }
  };

  const handleToggleCompleted = async (taskId, completed) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: taskId, completed: !completed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha ao atualizar a tarefa.');
      }

      // Se a atualização for bem-sucedida, atualize a lista no frontend
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed: !completed } : task
      ));

    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <div className="mt-8 text-center text-gray-500">Carregando tarefas...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-600">{error}</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="mt-8 text-center text-gray-500">Nenhuma tarefa encontrada. Adicione uma nova!</div>;
  }

  return (
    <div className="w-full max-w-lg mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Suas Tarefas</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`flex justify-between items-center p-4 border rounded-md transition-colors duration-200 ${
              task.completed ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleCompleted(task._id, task.completed)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className={`text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </span>
            </div>
            <button
              onClick={() => handleDelete(task._id)}
              className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}