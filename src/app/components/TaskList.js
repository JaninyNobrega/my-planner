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

      if (onTaskDeleted) {
        onTaskDeleted();
      }
      
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

      if (onTaskUpdated) {
        onTaskUpdated();
      }

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
      if (!editingTitle) {
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
      if (onTaskUpdated) {
        onTaskUpdated();
      }

    } catch (err) {
      console.error('Erro ao salvar edição:', err);
      alert(err.message);
    }
  };

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
            <div className="flex items-center space-x-3 w-full">
              {editingTaskId === task._id ? (
                // Modo de Edição
                <div className="flex w-full items-center">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(task._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(task._id);
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-blue-400 rounded-md focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(task._id)}
                    className="ml-2 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                // Modo de Visualização
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task._id, task.completed)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span
                    className={`text-gray-800 ml-3 flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
                    onDoubleClick={() => handleEdit(task._id, task.title)}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleEdit(task._id, task.title)}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            {!editingTaskId && (
                <button
                onClick={() => handleDelete(task._id)}
                className="ml-2 px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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