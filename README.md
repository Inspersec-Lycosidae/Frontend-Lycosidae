# 🛡️ Inspersec CTF Platform

Uma plataforma moderna e elegante para competições de Capture The Flag (CTF) em cibersegurança, desenvolvida com React, TypeScript e uma interface inspirada em terminais de hackers.

![Inspersec CTF](https://img.shields.io/badge/Inspersec-CTF-red?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?style=for-the-badge&logo=vite)

## 🎯 Visão Geral

O **Inspersec CTF** é uma plataforma web completa para gerenciar e participar de competições de cibersegurança. A aplicação oferece uma experiência imersiva com design inspirado em terminais de hackers, permitindo que usuários participem de múltiplas competições, resolvam desafios categorizados e acompanhem rankings em tempo real.

### ✨ Características Principais

- 🔐 **Sistema de Autenticação** - Login e registro de usuários
- 🏆 **Gerenciamento de Competições** - Participação em múltiplas competições simultâneas
- 🎯 **Desafios Categorizados** - Web, Crypto, Reverse Engineering, Pwn, Forensics e Misc
- 📊 **Rankings Dinâmicos** - Classificação em tempo real por competição
- 🛠️ **Toolbox Integrada** - Ferramentas úteis para resolução de desafios
- 🎨 **Interface Moderna** - Design dark theme com efeitos de glow e tipografia monospace
- 📱 **Responsivo** - Funciona perfeitamente em desktop e mobile

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca principal para interface
- **TypeScript 5.8.3** - Tipagem estática para maior segurança
- **Vite 5.4.19** - Build tool moderno e rápido
- **React Router DOM 6.30.1** - Roteamento client-side
- **TanStack Query 5.83.0** - Gerenciamento de estado servidor

### UI/UX
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **Shadcn/ui** - Sistema de design moderno
- **Lucide React** - Ícones SVG otimizados
- **Fira Code** - Fonte monospace para elementos de código

### Funcionalidades
- **React Hook Form 7.61.1** - Gerenciamento de formulários
- **Zod 3.25.76** - Validação de schemas
- **Date-fns 3.6.0** - Manipulação de datas
- **Sonner** - Sistema de notificações toast

## 📁 Estrutura do Projeto

```
frontend-Kairo/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base (Shadcn/ui)
│   │   ├── AuthPage.tsx   # Página de autenticação
│   │   ├── Dashboard.tsx  # Dashboard principal
│   │   └── CompetitionManager.tsx # Gerenciador de competições
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e configurações
│   ├── types/             # Definições TypeScript
│   ├── utils/             # Funções utilitárias
│   └── assets/            # Recursos estáticos
├── components.json        # Configuração Shadcn/ui
├── tailwind.config.ts     # Configuração Tailwind
└── vite.config.ts         # Configuração Vite
```

## 🎮 Funcionalidades Detalhadas

### 🔐 Autenticação
- **Login/Registro** - Sistema completo de autenticação
- **Persistência** - Dados salvos no localStorage
- **Validação** - Formulários com validação em tempo real

### 🏆 Competições
- **Múltiplas Competições** - Participe de várias competições simultaneamente
- **Códigos de Acesso** - Sistema de códigos para entrar em competições
- **Status Ativo** - Visualização de competições ativas
- **Datas de Período** - Controle de início e fim das competições

### 🎯 Desafios
- **6 Categorias** - Web, Crypto, Rev, Pwn, Forensics, Misc
- **Sistema de Pontos** - Cada desafio tem pontuação específica
- **Status Visual** - Indicadores visuais para desafios resolvidos/não resolvidos
- **Interatividade** - Clique para marcar como resolvido

### 📊 Rankings
- **Classificação em Tempo Real** - Rankings atualizados dinamicamente
- **Destaque do Usuário** - Sua posição destacada na tabela
- **Medalhas** - Ícones de troféu para top 3
- **Pontuação Total** - Soma de todos os pontos conquistados

### 🛠️ Toolbox
- **Conversor de Texto** - Base64, Hex, Binary, URL Encode/Decode
- **Identificador de Hash** - Identificação automática de tipos de hash
- **Links Úteis** - Acesso rápido a ferramentas externas (CyberChef, GDB, etc.)

### ⚙️ Configurações
- **Perfil do Usuário** - Edição de informações pessoais
- **Estatísticas** - Visualização de métricas de performance
- **Competições Ativas** - Contador de participações

## 🎨 Design System

### Paleta de Cores
- **Background**: `#0D1117` - Cinza espacial escuro
- **Primary**: `#B81D1D` - Vermelho profissional de cibersegurança
- **Success**: `#16A34A` - Verde para desafios resolvidos
- **Warning**: `#F59E0B` - Amarelo para progresso parcial

### Tipografia
- **Fira Code** - Fonte monospace para elementos de código
- **Inter** - Fonte sans-serif para interface geral

### Efeitos Visuais
- **Glow Effects** - Efeitos de brilho em elementos interativos
- **Terminal Style** - Bordas e focos inspirados em terminais
- **Smooth Transitions** - Animações suaves para melhor UX

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ ou Bun
- npm, yarn ou bun

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd frontend-Kairo
```

2. **Instale as dependências**
```bash
# Com npm
npm install

# Com yarn
yarn install

# Com bun
bun install
```

3. **Execute o servidor de desenvolvimento**
```bash
# Com npm
npm run dev

# Com yarn
yarn dev

# Com bun
bun dev
```

4. **Acesse a aplicação**
```
http://localhost:8080
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting do código
```

## 📱 Demonstração

### Tela de Login
- Interface elegante com logo Inspersec
- Formulários de login e registro
- Validação em tempo real

### Dashboard Principal
- Navegação por abas (Competições, Exercícios, Ranking, Toolbox, Conta)
- Visualização de competições ativas
- Estatísticas do usuário

### Gerenciamento de Competições
- Lista de competições participando
- Adicionar novas competições via código
- Remover participação

### Desafios
- Grid responsivo de desafios
- Categorização por cores e ícones
- Sistema de pontuação visual
- Status de resolução interativo

### Rankings
- Tabela de classificação
- Destaque da posição do usuário
- Medalhas para top 3

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Inspersec CTF
```

### Personalização
- **Cores**: Edite `src/index.css` para modificar a paleta
- **Componentes**: Customize em `src/components/ui/`
- **Dados Mock**: Modifique `src/utils/storage.ts`

## 🏗️ Arquitetura

### Padrões Utilizados
- **Component-Based Architecture** - Componentes reutilizáveis
- **Custom Hooks** - Lógica compartilhada
- **TypeScript Interfaces** - Tipagem forte
- **Local Storage** - Persistência de dados
- **Responsive Design** - Mobile-first approach

### Estrutura de Dados
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  competitions: string[];
}

interface Competition {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Challenge {
  id: number;
  name: string;
  category: "Web" | "Crypto" | "Rev" | "Pwn" | "Forensics" | "Misc";
  points: number;
  solved: boolean;
  competitionId: string;
}
```

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy no Vercel
```bash
# Instale o Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy no Netlify
```bash
# Build
npm run build

# Upload da pasta dist/
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ pela equipe **Inspersec** para a comunidade de cibersegurança.

## 🔗 Links Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Inspersec CTF** - Transformando a educação em cibersegurança através de competições interativas e envolventes! 🛡️✨