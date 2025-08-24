# Gerenciador de Tarefas Full-Stack com Next.js

## Descrição do Projeto

Este é um projeto de um gerenciador de tarefas completo, construído com Next.js e MongoDB. O objetivo foi criar uma aplicação web que permite a um usuário se registrar, fazer login e gerenciar suas próprias tarefas de forma segura e eficiente.

## Funcionalidades

* **Autenticação Segura**: Registro de novos usuários e login com senhas criptografadas.
* **Rotas Protegidas**: Acesso ao dashboard somente para usuários autenticados, utilizando tokens JWT.
* **Gerenciamento Completo de Tarefas (CRUD)**:
    * **C**riar: Adicionar novas tarefas.
    * **L**er: Visualizar a lista de tarefas.
    * **U**pdate: Marcar tarefas como concluídas ou editar o título.
    * **D**eletar: Remover tarefas da lista.
* **Comunicação Dinâmica**: A lista de tarefas é atualizada em tempo real sem a necessidade de recarregar a página.
* **Navegação Intuitiva**: Página inicial com links para login e registro.

## Tecnologias Utilizadas

* **Frontend**: Next.js 14, React, Tailwind CSS, `js-cookie`.
* **Backend**: Next.js Route Handlers (API Routes), `jsonwebtoken`, `bcryptjs`.
* **Banco de Dados**: MongoDB Atlas.
* **Ambiente de Desenvolvimento**: Node.js, Vercel (opcional para deploy).

## Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/JaninyNobrega/my-planner.git]
    cd [my-planner]
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configurações do Ambiente (`.env.local`):**
    * Crie um arquivo na raiz do projeto chamado `.env.local`.
    * Adicione suas chaves de conexão e segredos. (Não se esqueça que este arquivo é ignorado pelo Git por segurança).
    ```env
    MONGODB_URI=[SUA_STRING_DE_CONEXAO_DO_MONGODB]
    JWT_SECRET=[UMA_STRING_SECRETA_E_LONGA_ALEATORIA]
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O aplicativo estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

/
├── public/                # Assets públicos
├── src/
│   ├── app/
│   │   ├── api/           # Rotas de API
│   │   │   ├── auth/      # Rotas de login e registro
│   │   │   └── tasks/     # Rotas CRUD para tarefas
│   │   ├── components/    # Componentes reutilizáveis do React
│   │   ├── auth/          # Páginas de login e registro
│   │   ├── dashboard/     # Página protegida do usuário
│   │   └── ...
│   └── lib/               # Biblioteca de conexão com o MongoDB
│
├── .env.local             # Variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json
└── README.md              # Este arquivo


## Licença

Este projeto está licenciado sob a Licença MIT.