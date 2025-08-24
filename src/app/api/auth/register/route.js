import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Validação simples dos dados recebidos
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email e senha são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Conecte ao MongoDB usando a nossa função
    const client = await clientPromise;
    const db = client.db("projeto-fullstack"); 
    const usersCollection = db.collection("users"); 

    // 3. o usuário já existe?
    const userExists = await usersCollection.findOne({ email: email });
    if (userExists) {
      return new Response(JSON.stringify({ message: 'Este email já está em uso.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Criptografe a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Salve o novo usuário no banco de dados
    const result = await usersCollection.insertOne({
      email: email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ message: 'Usuário registrado com sucesso!', userId: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return new Response(JSON.stringify({ message: 'Ocorreu um erro no servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}