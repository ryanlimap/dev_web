## 📊 2. Estrutura de Dados

### 🧑 Usuário

```json
{
  "id": "u001",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senhaHash": "********",
  "playlists": ["p001", "p002"],
  "favoritos": ["m003", "m005"]
}
```

### 🎵 Música

```
{
  "id": "m001",
  "titulo": "Nome da Música",
  "artista": "Nome do Artista",
  "album": "Nome do Álbum",
  "capaUrl": "https://.../album.jpg",
  "arquivoUrl": "https://.../musica.mp3",
  "duracao": 210
}
```

### 📂 Playlist
```
{
  "id": "p001",
  "nome": "Minhas Favoritas",
  "idUsuario": "u001",
  "musicas": ["m001", "m002", "m004"]
}
```

### ❤️ Favoritos 
```
{
  "idUsuario": "u001",
  "musicasFavoritas": ["m001", "m004"]
}
```



