# CodeLeap Network - Social Media Application

Teste técnico para desenvolvedor frontend júnior - Aplicação de rede social desenvolvida com React, TypeScript e Vite, seguindo as melhores práticas do mercado.

🌐 **Acesse a aplicação:** [https://test-code-leap-delta.vercel.app/](https://test-code-leap-delta.vercel.app/)

## 🚀 Funcionalidades

### Autenticação
- ✅ Modal de cadastro com validação de username
- ✅ Validação com Zod (mínimo 3 caracteres, máximo 20, apenas letras)
- ✅ Persistência de usuário no localStorage
- ✅ Logout com redirecionamento automático para tela de login

### Posts
- ✅ Criação de posts com título e conteúdo
- ✅ Listagem de posts ordenados do mais recente para o mais antigo
- ✅ Edição de posts (apenas do próprio usuário)
- ✅ Exclusão de posts com confirmação (apenas do próprio usuário)
- ✅ Upload de imagens nos posts (opcional, máx. 5MB)
- ✅ Preview de imagens antes de enviar
- ✅ Validação de tipo e tamanho de arquivo
- ✅ Exibição de imagens nos posts com animações

### Interações
- ✅ Sistema de likes com contador
- ✅ Sistema de comentários
- ✅ Campo de comentário que aparece ao clicar no botão
- ✅ Lista de comentários exibida abaixo do input
- ✅ Detecção e destaque de menções (@username) no conteúdo
- ✅ Contador de menções exibido nas interações

### Persistência Local
- ✅ Imagens salvas no localStorage
- ✅ Likes salvos no localStorage
- ✅ Comentários salvos no localStorage
- ✅ Dados persistem entre sessões

### Animações e UX
- ✅ Animações de entrada (fadeIn, slideIn, scaleIn, bounceIn)
- ✅ Transições suaves em botões e elementos
- ✅ Efeitos de hover com elevação e sombra
- ✅ Animações nas imagens (fade-in com blur, zoom ao carregar)
- ✅ Loading spinner animado
- ✅ Efeitos de foco em inputs com ring colorido
- ✅ Animações escalonadas na lista de posts

### Acessibilidade
- ✅ ARIA attributes em formulários
- ✅ Labels descritivos
- ✅ Feedback visual de erros
- ✅ Navegação por teclado

### Performance
- ✅ Atualização otimista de estado (sem refetch desnecessário)
- ✅ Cancelamento de requisições ao desmontar componentes
- ✅ Loading states granulares por ação
- ✅ Lazy loading de imagens

## 🛠️ Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server rápido
- **Tailwind CSS** - Framework CSS utility-first
- **Zod** - Validação de schemas TypeScript-first
- **React Toastify** - Notificações toast elegantes
- **date-fns** - Manipulação de datas
- **ESLint** - Linter para JavaScript/TypeScript

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Isaquelins523/Test-CodeLeap.git

# Entre no diretório
cd CodeLeap-test

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── SignupModal/    # Modal de cadastro
│   ├── MainScreen/      # Tela principal
│   ├── PostForm/        # Formulário de criação de posts
│   ├── PostList/        # Lista de posts
│   ├── PostCard/        # Card individual de post
│   ├── PostInteractions/# Interações (likes, comentários)
│   ├── EditPostModal/   # Modal de edição
│   └── DeletePostAlert/ # Alerta de confirmação de exclusão
├── hooks/               # Custom hooks
│   ├── useLocalStorage/ # Hook para localStorage
│   └── usePosts/        # Hook para gerenciar posts
├── utils/               # Funções utilitárias
│   ├── date.ts          # Formatação de datas
│   ├── mentions.ts      # Detecção de menções
│   ├── imageStorage.ts  # Gerenciamento de imagens no localStorage
│   └── postInteractionsStorage.ts # Gerenciamento de likes/comentários
├── types/               # Definições TypeScript
│   ├── user.ts          # Tipo de usuário
│   └── post.ts          # Tipo de post
├── schemas/             # Schemas de validação Zod
│   ├── signup.schema.ts # Validação de cadastro
│   └── post.schema.ts   # Validação de posts
└── config/              # Configurações
    └── api.ts           # Configuração da API
```

## 🎨 Design

- **Fonte:** Roboto (Google Fonts)
- **Cores principais:**
  - Azul: `#7695EC` (botões primários, headers)
  - Verde: `#47B960` (botão de salvar)
  - Vermelho: `#FF5151` (botão de deletar, logout)
  - Cinza: `#DDDDDD` (background)
  - Branco: `#FFFFFF` (cards)

## 🔧 Funcionalidades Técnicas

### Validação de Formulários
- Validação em tempo real com Zod
- Mensagens de erro descritivas
- Feedback visual (bordas vermelhas, mensagens de erro)

### Gerenciamento de Estado
- Custom hooks para lógica reutilizável
- Estado local otimizado
- Sincronização com localStorage

### API Integration
- CRUD completo de posts
- Tratamento de erros
- Cancelamento de requisições
- URLs normalizadas com trailing slash (compatível com Django)

### Animações CSS
- Keyframes customizados
- Transições suaves
- Efeitos de hover e focus
- Animações de entrada escalonadas

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop
- Tablet
- Mobile

## 🔒 Segurança

- Validação de inputs no cliente
- Sanitização de dados
- Tratamento de erros de quota do localStorage
- Prevenção de XSS com validação de tipos

## 🚀 Deploy

A aplicação está deployada na Vercel:
- **URL:** [https://test-code-leap-delta.vercel.app/](https://test-code-leap-delta.vercel.app/)

## 📝 Notas

- As imagens são armazenadas como base64 no localStorage
- Likes e comentários são persistidos localmente
- A API é fornecida pela CodeLeap: `https://dev.codeleap.co.uk/careers/`
- Todas as URLs da API terminam com "/" para compatibilidade com Django

## 👨‍💻 Autor

**Isaque Lins**
- GitHub: [@Isaquelins523](https://github.com/Isaquelins523)

## 📄 Sobre o Projeto

Este projeto foi desenvolvido como **teste técnico para desenvolvedor frontend júnior** na CodeLeap. A aplicação demonstra habilidades em:

- Desenvolvimento React com TypeScript
- Gerenciamento de estado e hooks customizados
- Integração com APIs REST
- Validação de formulários
- Persistência de dados local
- Animações e UX moderna
- Responsividade
- Boas práticas de código
