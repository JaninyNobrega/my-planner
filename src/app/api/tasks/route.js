import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // 1. Verifique se o token de autenticação existe
    if (!token) {
      return new Response(JSON.stringify({ message: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    

    // 2. Decodifique o token para obter o ID do usuário
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // 3. Receba os dados da nova tarefa
    const { title, description } = await request.json();

    if (!title) {
      return new Response(JSON.stringify({ message: 'O título da tarefa é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Conecte ao banco de dados e à coleção de tarefas
    const client = await clientPromise;
    const db = client.db("projeto-fullstack"); 
    const tasksCollection = db.collection("tasks");

    // 5. Crie a nova tarefa
    const newTask = {
      userId: new ObjectId(userId), 
      title,
      description: description || null,
      completed: false,
      createdAt: new Date(),
    };

    const result = await tasksCollection.insertOne(newTask);

    return new Response(JSON.stringify({ message: 'Tarefa criada com sucesso!', taskId: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return new Response(JSON.stringify({ message: 'Erro ao criar a tarefa.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // 1. Verifique se o token de autenticação existe
    if (!token) {
      return new Response(JSON.stringify({ message: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Decodifique o token para obter o ID do usuário
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // 3. Conecte ao banco de dados e busque as tarefas do usuário
    const client = await clientPromise;
    const db = client.db("projeto-fullstack"); 
    const tasksCollection = db.collection("tasks");

    // Busque apenas as tarefas cujo userId corresponda ao usuário logado
    const userTasks = await tasksCollection.find({ userId: new ObjectId(userId) }).toArray();

    return new Response(JSON.stringify(userTasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return new Response(JSON.stringify({ message: 'Erro ao buscar as tarefas.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // 1. Verifique se o token de autenticação existe
    if (!token) {
      return new Response(JSON.stringify({ message: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Decodifique o token para obter o ID do usuário
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // 3. Receba o ID da tarefa a ser deletada
    const { id } = await request.json();

    // 4. Valide se o ID da tarefa foi fornecido
    if (!id) {
      return new Response(JSON.stringify({ message: 'ID da tarefa é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Conecte ao banco de dados
    const client = await clientPromise;
    const db = client.db("projeto-fullstack"); // Verifique o nome do BD
    const tasksCollection = db.collection("tasks");

    // 6. deletar a tarefa, verificando se o ID do usuário corresponde
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id), userId: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: 'Tarefa não encontrada ou você não tem permissão para deletá-la.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Tarefa deletada com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return new Response(JSON.stringify({ message: 'Erro ao deletar a tarefa.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // 1. Verifique se o token de autenticação existe
    if (!token) {
      return new Response(JSON.stringify({ message: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Decodifique o token para obter o ID do usuário
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // 3. Receba os dados da atualização
    const { id, completed, title } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ message: 'ID da tarefa é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updateFields = {};
    if (typeof completed === 'boolean') {
        updateFields.completed = completed;
    }
    if (typeof title === 'string') {
        updateFields.title = title;
    }

    if (Object.keys(updateFields).length === 0) {
        return new Response(JSON.stringify({ message: 'Nenhum campo para atualizar fornecido.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    // 4. Conecte ao banco de dados
    const client = await clientPromise;
    const db = client.db("projeto-fullstack"); 
    const tasksCollection = db.collection("tasks");

    // 5. Tente atualizar a tarefa, verificando se o ID do usuário corresponde
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: 'Tarefa não encontrada ou você não tem permissão para atualizá-la.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Tarefa atualizada com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return new Response(JSON.stringify({ message: 'Erro ao atualizar a tarefa.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}