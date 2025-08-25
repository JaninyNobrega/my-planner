'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

export default function TaskList({ tasks, loading, error, onTaskDeleted, onTaskUpdated }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

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

      if (onTaskDeleted) onTaskDeleted();
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

      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      alert(err.message);
    }
  };

  const handleEdit = (taskId, currentTitle) => {
    setEditingTaskId(taskId);
    setEditingTitle(currentTitle);
  };

  const handleSaveEdit = async (taskId) => {
    try {
      if (!editingTitle.trim()) {
        alert('O título não pode estar vazio.');
        return;
      }
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
        body: JSON.stringify({ id: taskId, title: editingTitle }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha ao salvar a edição.');
      }

      setEditingTaskId(null);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
      alert(err.message);
    }
  };

  if (loading)
    return <div className="mt-8 text-center text-white/80">Carregando tarefas...</div>;

  if (error)
    return <div className="mt-8 text-center text-red-400">{error}</div>;

  if (tasks.length === 0)
    return <div className="mt-8 text-center text-white/70">Nenhuma tarefa encontrada. Adicione uma nova!</div>;

  return (
    <div className="w-full max-w-3xl mt-6 p-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Suas Tarefas</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`flex justify-between items-center p-4 border rounded-xl transition-all duration-200 ${
              task.completed
                ? 'bg-green-100/20 border-green-300/50 text-green-200'
                : 'bg-white/20 border-white/30 text-white'
            } hover:scale-[1.02]`}
          >
            <div className="flex items-center space-x-3 w-full">
              {editingTaskId === task._id ? (
                <div className="flex w-full items-center">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(task._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(task._id);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-blue-400 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(task._id)}
                    className="ml-2 p-3 py-1 sm:p-4 text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task._id, task.completed)}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded"
                  />
                  <span
                    className={`ml-3 flex-1 cursor-pointer ${
                      task.completed ? 'line-through text-white/50' : ''
                    }`}
                    onDoubleClick={() => handleEdit(task._id, task.title)}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleEdit(task._id, task.title)}
                    className="ml-2 p-3 py-1 sm:p-4 text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            {!editingTaskId && (
              <button
                onClick={() => handleDelete(task._id)}
                className="ml-2 p-3 py-1 text-base sm:p-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Deletar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
