# 🎧 Modelagem Inicial – Player de Música Web (Estilo Spotify)

## 🧱 1. Arquitetura da Aplicação

### 📦 Frontend

- Framework sugerido: React.js + TailwindCSS
- Responsabilidades:
  - Interface do usuário (player, listas, busca, login, etc.)
  - Gerenciamento de estado da reprodução e playlists
  - Consumo da API (se houver)
  - Armazenamento local (localStorage ou IndexedDB)

### 🖥️ Backend (opcional)

- Stack sugerido: Node.js + Express (ou Firebase como alternativa serverless)
- Responsabilidades:
  - Autenticação de usuários
  - Armazenamento de playlists e favoritos
  - Servir arquivos de música ou conectar a uma API externa

### 🗄️ Banco de Dados

- Opções: MongoDB, Firebase Firestore, ou SQLite
- Responsabilidades:
  - Armazenar usuários, músicas, playlists e favoritos
