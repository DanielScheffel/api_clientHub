# 🚀 API ClientHub

API REST para **gestão de clientes e pipeline comercial**, inspirada em CRMs reais.

Este projeto foi desenvolvido com foco em **regras de negócio**, **segurança**, **auditoria** e **KPIs**, indo além de um CRUD simples.

---

## 🧠 Visão Geral

A API ClientHub permite que empresas gerenciem seus clientes, acompanhem o funil de vendas (pipeline), controlem usuários internos e visualizem métricas estratégicas (KPIs).

O sistema trabalha com **dois tipos de usuários**:
- **Admin**: controle total do sistema
- **Usuário comum**: gerencia apenas seus próprios clientes

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
 ├─ controllers/   # Camada HTTP (entrada/saída)
 ├─ services/      # Regras de negócio
 ├─ routes/        # Definição de rotas
 ├─ middlewares/   # Autenticação e validações
 └─ database/      # Conexão e migrations
```

📌 Controllers são **finos** e toda a lógica está concentrada nos **services**.

---

## 🔐 Autenticação & Autorização

- Autenticação via **JWT**
- Middleware protege rotas privadas
- Usuários **inativos** não conseguem logar
- Controle de acesso por tipo de usuário

---

## 👤 Usuários

### Funcionalidades
- Criar usuário
- Editar usuário
- Desativar usuário (soft delete lógico)
- Bloquear login de usuários inativos
- Admin pode gerenciar todos os usuários

📌 Usuários **não são deletados fisicamente**, apenas desativados, preservando histórico e auditoria.

---

## 👥 Clientes

### Funcionalidades
- Criar cliente
- Listar clientes do usuário
- Buscar cliente por ID
- Editar cliente
- Soft delete de cliente

### Reatribuição de clientes
- Apenas **admin** pode reatribuir clientes
- Clientes de usuários inativos podem ser transferidos para outro usuário
- Nenhum cliente fica órfão

---

## 🔄 Pipeline de Status

Cada cliente possui um status no funil de vendas:

```
novo → contatado → negociação → fechado
                    ↘ perdido
```

### Regras
- Transições inválidas são bloqueadas
- Não é permitido atualizar para o mesmo status
- Toda mudança gera histórico

---

## 🕒 Histórico de Status

Todas as mudanças de status são registradas em uma tabela específica:
- Status anterior
- Novo status
- Data da mudança

📌 Base essencial para métricas e auditoria.

---

## 📊 KPIs Disponíveis

### 🥇 KPI 1 — Distribuição de clientes por status
- Quantidade de clientes em cada etapa do pipeline

### 🥈 KPI 2 — Clientes por usuário
- Quantos clientes cada usuário possui

### 🥉 KPI 3 — Conversão
- Conversão global
- Conversão por usuário

### 🏅 KPI 4 — Tempo médio por status
- Tempo médio que clientes permanecem em cada status

📌 KPIs acessíveis apenas para **admin**.

---

## 🗄️ Banco de Dados

- PostgreSQL
- Uso de ENUM para status
- Soft delete (`deletado` / `status`)
- Tabelas separadas para histórico

---

## 🧪 Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

---

## ▶️ Como Executar

```bash
# instalar dependências
npm install

# rodar o projeto
npm run dev
```

Configure o arquivo `.env` com suas credenciais de banco e JWT.

---

## 🎯 Objetivo do Projeto

Este projeto foi criado com foco em:
- Portfólio backend
- Simular um sistema corporativo real
- Demonstrar domínio de regras de negócio
- Prática de arquitetura limpa

---

## 📌 Próximos Passos (opcional)

- Frontend para visualização dos KPIs
- Logs de auditoria por usuário
- Mais KPIs estratégicos

---

## 👨‍💻 Autor

Desenvolvido por **Daniel Scheffel** 🚀

---

⭐ Se este projeto te ajudou ou inspirou, deixe uma estrela no repositório!

