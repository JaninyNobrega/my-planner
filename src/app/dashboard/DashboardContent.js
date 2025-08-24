'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import AddTaskForm from '@/app/components/AddTaskForm';
import TaskList from '@/app/components/TaskList';

function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/auth/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      Sair
    </button>
  );
}

export default function DashboardContent({ userEmail }) {
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mt-12">Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Bem-vindo, **{userEmail}**.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Aqui você pode gerenciar suas tarefas.
      </p>
      
      <AddTaskForm onTaskAdded={fetchTasks} />
      <TaskList 
        tasks={tasks}
        loading={loading}
        error={error}
        onTaskDeleted={fetchTasks}
        onTaskUpdated={fetchTasks}
      />
      <LogoutButton />
    </>
  );
}