import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import DashboardContent from './DashboardContet';

export default function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const userEmail = decodedToken.email;

    return (
      <div className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
        <DashboardContent userEmail={userEmail} />
      </div>
    );

  } catch (error) {
    console.error('Falha na autenticação do token:', error);
    redirect('/auth/login');
  }
}