# API de Gestão de Pedidos — Challenge Técnico

![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-4-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Swagger](https://img.shields.io/badge/Docs-Swagger-purple)

API RESTful para gestão de pedidos desenvolvida como Challenge Técnico Jitterbit.

🔗 Documentação Swagger: `http://localhost:3000/api-docs`

---

## 📌 Contexto do Projeto

Este projeto foi desenvolvido como parte de um teste técnico do processo seletivo para a vaga de **Analista de Sistemas Jr.** O desafio consiste em desenvolver uma API RESTful para gestão de pedidos, utilizando **Node.js**, **Express** e **MongoDB**, simulando um cenário real de integração de sistemas.

---

## 📁 Estrutura do Projeto

```
├── config/
│   ├── database.js         # Conexão com MongoDB
│   └── swagger.js          # Configuração do Swagger
├── controllers/
│   ├── authController.js   # Lógica de autenticação
│   └── orderController.js  # Lógica de pedidos (CRUD)
├── middlewares/
│   ├── authMiddleware.js   # Verificação do token JWT
│   └── errorHandler.js     # Tratamento global de erros
├── models/
│   └── orderModel.js       # Schema do pedido (Mongoose)
├── routes/
│   ├── authRoutes.js       # Rotas de autenticação
│   └── orderRoutes.js      # Rotas de pedidos
├── .env.example            # Variáveis de ambiente necessárias
├── index.js                # Entry point da aplicação
└── package.json
```

---

## ⚙️ Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/XavieremJs/Challenge-Jitterbit-Teste-teorico-.git
cd Challenge-Jitterbit-Teste-teorico-
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/pedidos
JWT_SECRET=sua_chave_secreta_aqui
```

### 4. Inicie o servidor

```bash
# Produção
npm start

# Desenvolvimento (com hot reload)
npm run dev
```

API disponível em `http://localhost:3000`

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)**. Faça login para obter o token e envie-o no header de todas as rotas protegidas:

```
Authorization: Bearer <seu_token_aqui>
```

> Credenciais padrão: `username: admin` / `password: admin123`

---

## 📡 API Endpoints

### 🔑 Autenticação (pública)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login e obter token JWT |

### 📦 Pedidos (requer JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/order` | Criar novo pedido |
| `GET` | `/order/list` | Listar todos os pedidos |
| `GET` | `/order/:id` | Obter pedido por ID |
| `PUT` | `/order/:id` | Atualizar pedido existente |
| `DELETE` | `/order/:id` | Deletar pedido |

---

## 📝 Exemplos de Request / Response

### `POST /auth/login`

```json
// Request
{
  "username": "admin",
  "password": "admin123"
}

// Response 200 OK
{
  "mensagem": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expira_em": "1h"
}
```

---

### `POST /order`

```json
// Request — Authorization: Bearer <token>
{
  "numeroPedido": "PED-001",
  "valorTotal": 99.80,
  "dataCriacao": "2026-03-09",
  "items": [
    {
      "idItem": 101,
      "quantidadeItem": 2,
      "valorItem": 49.90
    }
  ]
}

// Response 201 Created
{
  "mensagem": "Pedido criado com sucesso",
  "pedido": {
    "_id": "64abc123def456",
    "orderId": "PED-001",
    "value": 99.80,
    "creationDate": "2026-03-09T00:00:00.000Z",
    "items": [
      { "productId": 101, "quantity": 2, "price": 49.90 }
    ]
  }
}
```

---

### `GET /order/list`

```json
// Response 200 OK — Authorization: Bearer <token>
{
  "total": 1,
  "pedidos": [
    {
      "_id": "64abc123def456",
      "orderId": "PED-001",
      "value": 99.80,
      "creationDate": "2026-03-09T00:00:00.000Z",
      "items": [
        { "productId": 101, "quantity": 2, "price": 49.90 }
      ]
    }
  ]
}
```

---

### `PUT /order/:id`

```json
// Request — Authorization: Bearer <token>
{
  "numeroPedido": "PED-001",
  "valorTotal": 149.90,
  "dataCriacao": "2026-03-09",
  "items": [
    {
      "idItem": 101,
      "quantidadeItem": 3,
      "valorItem": 49.90
    }
  ]
}

// Response 200 OK
{
  "mensagem": "Pedido atualizado com sucesso",
  "pedido": {
    "_id": "64abc123def456",
    "orderId": "PED-001",
    "value": 149.90,
    "creationDate": "2026-03-09T00:00:00.000Z",
    "items": [
      { "productId": 101, "quantity": 3, "price": 49.90 }
    ]
  }
}
```

---

### `DELETE /order/:id`

```json
// Response 200 OK — Authorization: Bearer <token>
{
  "mensagem": "Pedido deletado com sucesso",
  "pedido": {
    "_id": "64abc123def456",
    "orderId": "PED-001",
    "value": 99.80
  }
}
```

---

## 🗂️ Mapeamento de Dados

Os campos da requisição são mapeados para o schema interno do MongoDB:

| Campo na Requisição | Campo no Banco | Tipo | Obrigatório |
|---------------------|----------------|------|-------------|
| `numeroPedido` | `orderId` | String | ✅ |
| `valorTotal` | `value` | Number | ✅ |
| `dataCriacao` | `creationDate` | Date | ✅ |
| `items[].idItem` | `items[].productId` | Number | ✅ |
| `items[].quantidadeItem` | `items[].quantity` | Number | ✅ |
| `items[].valorItem` | `items[].price` | Number | ✅ |

---

## 🔴 Respostas HTTP

| Código | Status | Quando ocorre |
|--------|--------|---------------|
| `200` | OK | Requisição bem-sucedida |
| `201` | Created | Pedido criado com sucesso |
| `400` | Bad Request | Dados inválidos ou ID mal formatado |
| `401` | Unauthorized | Token ausente, inválido ou expirado |
| `404` | Not Found | Pedido não encontrado |
| `409` | Conflict | `numeroPedido` já existe |
| `500` | Internal Server Error | Erro interno no servidor |

---

## 👨‍💻 Autor

**Euclides Xavier Rivera Peña**

[![GitHub](https://img.shields.io/badge/GitHub-XavieremJs-black?logo=github)](https://github.com/XavieremJs)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Euclides%20Xavier-blue?logo=linkedin)](https://www.linkedin.com/in/euclides-xavier-rivera-pena-987303195/)
[![Email](https://img.shields.io/badge/Email-Xavier8pen@gmail.com-red?logo=gmail)](mailto:Xavier8pen@gmail.com)