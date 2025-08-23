import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Validação simples
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email e senha são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Conecte ao MongoDB e à coleção de usuários
    const client = await clientPromise;
    const db = client.db("projeto-fullstack"); //nome do meu banco de dados no mongodb
    const usersCollection = db.collection("users");

    // 3. Verifique se o usuário existe
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Verifique a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Login realizado com sucesso!', user: user.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return new Response(JSON.stringify({ message: 'Ocorreu um erro no servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}