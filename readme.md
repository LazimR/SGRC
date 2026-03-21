# CinemaReserve

Sistema de reserva de assentos para cinema, com frontend em React e backend em Spring Boot.

---

## Frontend

Desenvolvido com **React**, **Vite** e **TypeScript**.

### Requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado em **http://localhost:5174**

---

## Backend

Desenvolvido com **Spring Boot** e containerizado com **Docker**.

### Requisitos

- Docker
- Docker Compose

### Instalação

na raiz do projeto:

Suba os containers:

```bash
docker compose up --build
```

A API estará disponível em **http://localhost:8080**
