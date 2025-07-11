# NLW-Chat 🚀💬

Projeto desenvolvido para fins de estudo.

---

## 📜 Sobre o Projeto

NLW-Chat é uma aplicação de **chat em tempo real** que permite a criação de salas e interação entre usuários. O projeto utiliza tecnologias modernas do ecossistema React, com foco em boas práticas e arquitetura baseada em componentes.

---

## 🛠️ Tecnologias & Ferramentas

| Categoria           | Tecnologias                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework           | [React](https://react.dev/)                                                                                                                           |
| Build Tool          | [Vite](https://vitejs.dev/)                                                                                                                           |
| Linguagem           | [TypeScript](https://www.typescriptlang.org/)                                                                                                         |
| Estilização         | [Tailwind CSS](https://tailwindcss.com/), [class-variance-authority](https://cva.style/), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| UI Components       | Padrão [shadcn/ui], [Radix UI (Slot)](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)                                                 |
| Roteamento          | [React Router DOM](https://reactrouter.com/)                                                                                                          |
| Estado de Servidor  | [TanStack Query (React Query)](https://tanstack.com/query/latest)                                                                                     |
| Qualidade de Código | [Biome](https://biomejs.dev/)                                                                                                                         |

---

## 🧩 Padrões & Arquitetura

- **Componentização:** Modularização em componentes reutilizáveis (`src/components`).
- **Estrutura de Páginas:** Views organizadas em `src/pages`.
- **Path Aliases:** Importações simplificadas (`@/*`) via `tsconfig.json` e `vite.config.ts`.
- **Utilitários:** Funções como `cn` para mesclar classes CSS em `src/lib/utils.ts`.

---

## ⚙️ Como rodar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd nlw-chat
```

### 2️⃣ Instalar dependências

Escolha seu gerenciador de pacotes favorito:

```bash
npm install
# ou
yarn install
```

### 3️⃣ Executar em modo desenvolvimento

```bash
npm run dev
```

### 4️⃣ Gerar build de produção

```bash
npm run build
```

### 5️⃣ Visualizar build de produção

```bash
npm run preview
```

---

## 💡 Dicas

- Recomendo usar o [VS Code](https://code.visualstudio.com/) com extensões para React, Tailwind e Biome para melhor experiência.
- Siga os padrões de componentes e utilize os utilitários para manter o código limpo e consistente.

---

## 📚 Referências & Links

- [Rocketseat](https://rocketseat.com.br/)
- [NLW](https://nextlevelweek.com/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do React](https://react.dev/)

---

<div align="center">
  <img src="./public/react.svg" width="80" alt="React Logo" />
  <br/>
  <strong>Bye</strong>
</div>
