'use client';
import { useState, useEffect, useCallback } from 'react';
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
      className="ml-auto px-8 py-2 mt-2 text-white bg-red-600 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300"
    >
      Sair
    </button>
  );
}

export default function DashboardContent({ userEmail }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
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
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        Cookies.remove('token');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) throw new Error('Falha ao buscar as tarefas.');

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 flex items-center justify-center p-2">
      <div className="w-full max-w-2xl p-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl text-white space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-lg">Bem-vindo, <span className="font-semibold">{userEmail}</span>.</p>
          </div>
          <LogoutButton />
        </header>
        {loading && <p className="text-center">Carregando tarefas...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}
        <main className="space-y-6">
          <AddTaskForm onTaskAdded={fetchTasks} />
          <TaskList tasks={tasks} loading={loading} error={error} onTaskDeleted={fetchTasks} onTaskUpdated={fetchTasks} />
        </main>
      </div>
    </div>
  );
}
