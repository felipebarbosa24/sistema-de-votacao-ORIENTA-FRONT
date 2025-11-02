# Sistema de Votação Estudantil 🗳️🏫
Um sistema de votação simples e intuitivo para eleições estudantis, com módulos para eleitores e administração.

## 📝 Descrição do Projeto

Este projeto é um sistema de votação desenvolvido para facilitar eleições em ambientes estudantis, no âmbito do programa ORIENTA, uma iniciativa em parceria com a FACEPE e a Capyvara Company. Ele oferece uma interface para os estudantes se identificarem e votarem, e um painel administrativo para gerenciar eleições, chapas, e visualizar relatórios. A persistência dos dados é feita localmente no navegador, tornando-o ideal para demonstrações ou uso em pequena escala sem a necessidade de um backend complexo.

## ✨ Funcionalidades

### Módulo de Estudante (Eleitor)
*   **Identificação Segura**: Os eleitores se identificam com nome completo e CPF.
*   **Validação de CPF**: Verificação de formato e validade do CPF.
*   **Controle de Voto Único**: Garante que cada CPF vote apenas uma vez por eleição.
*   **Acesso a Eleições Ativas**: Permite votar apenas em eleições que estão abertas no momento.

### Módulo de Administração
*   **Autenticação Simples**: Acesso restrito ao painel administrativo.
*   **Criação de Eleições**: Crie novas eleições com título, descrição e defina as chapas concorrentes.
*   **Gestão de Chapas**: Adicione, edite e remova chapas para cada eleição, com validação de nomes e números únicos.
*   **Relatórios Detalhados**: Visualize estatísticas de eleições, incluindo total de votos, eleitores e resultados por chapa.
*   **Exportação de Relatórios**: Exporte um relatório geral em formato de texto (`.txt`) com todos os detalhes das eleições e resultados.
*   **Backup e Restauração de Dados**: Exporte e importe todos os dados do sistema (eleições, votos, eleitores) em formato JSON.
*   **Limpeza de Dados**: Funcionalidade de "Zona de Perigo" para apagar todos os dados do sistema (com confirmação dupla).

## 🚀 Tecnologias Utilizadas

*   **Next.js**: Framework React para desenvolvimento de aplicações web.
*   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
*   **Shadcn UI**: Componentes de UI acessíveis e personalizáveis construídos com Tailwind CSS e Radix UI.
*   **Local Storage**: Utilizado para persistência de dados no navegador.
*   **Lucide React**: Biblioteca de ícones.

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou yarn/pnpm) instalados em sua máquina.

*   Node.js (versão 18 ou superior)
*   npm (ou yarn/pnpm)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/felipebarbosa24/sistema-de-votacao-orienta.git
    cd sistema-votacao-orienta
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    # ou pnpm install
    ```

### Execução

1.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou yarn dev
    # ou pnpm dev
    ```
2.  Abra seu navegador e acesse `http://localhost:3000`.

### Acesso ao Painel Administrativo

Para acessar o painel administrativo, navegue para `http://localhost:3000/admin`.
A autenticação é feita localmente. Para simular o login, você pode definir `localStorage.setItem("adminAuth", "true")` no console do navegador ou implementar uma tela de login simples.

## 📂 Estrutura do Projeto

*   `app/`: Páginas da aplicação (eleitor, admin, etc.).
*   `components/`: Componentes React reutilizáveis, incluindo componentes de UI (`ui/`).
*   `lib/`: Funções utilitárias e lógica de persistência de dados (`storage.ts`, `utils/cpf.ts`).
*   `public/`: Ativos estáticos.