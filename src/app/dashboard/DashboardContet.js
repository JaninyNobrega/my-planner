'use client';

import AddTaskForm from '@/app/components/AddTaskForm';
import TaskList from '@/app/components/TaskList';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mt-12">Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Bem-vindo, **{userEmail}**.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Aqui você pode gerenciar suas tarefas.
      </p>

      <AddTaskForm />
      <TaskList />
      <LogoutButton />
    </>
  );
}