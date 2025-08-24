import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email e senha são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db("projeto-fullstack");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Gerar o JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    return new Response(JSON.stringify({ message: 'Login realizado com sucesso!', token: token }), {
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