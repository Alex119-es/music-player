# Documentacion de la API REST

## Informacion general

La API de MusicPlayer proporciona endpoints RESTful para interactuar con todas las entidades del sistema. Todos los endpoints requieren autenticacion JWT excepto donde se indique lo contrario.

## Autenticacion

### Iniciar sesion

**POST** `/api/authenticate`

Autentica a un usuario y devuelve un token JWT.

**Cuerpo de la peticion:**
```json
{
  "username": "usuario",
  "password": "contrasena"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "login": "usuario",
  "email": "usuario@ejemplo.com",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Registrar usuario

**POST** `/api/register`

Registra un nuevo usuario en el sistema.

**Cuerpo de la peticion:**
```json
{
  "login": "nuevousuario",
  "email": "nuevousuario@ejemplo.com",
  "password": "contrasena123",
  "firstName": "Nombre",
  "lastName": "Apellido"
}
```

## Generos musicales

### Obtener todos los generos

**GET** `/api/genres`

Devuelve una lista paginada de generos musicales.

**Parametros de consulta:**
- `page`: Numero de pagina (default: 0)
- `size`: Tamano de pagina (default: 20)

**Respuesta:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Rock"
    }
  ],
  "totalElements": 15,
  "totalPages": 1
}
```

## Artistas

### Obtener todos los artistas

**GET** `/api/artists`

Devuelve una lista paginada de artistas.

**Parametros de consulta:**
- `page`: Numero de pagina
- `size`: Tamano de pagina

### Obtener un artista

**GET** `/api/artists/{id}`

Devuelve los detalles de un artista especifico.

### Crear artista

**POST** `/api/artists`

Crea un nuevo artista en el sistema.

### Actualizar artista

**PUT** `/api/artists/{id}`

Actualiza la informacion de un artista existente.

### Eliminar artista

**DELETE** `/api/artists/{id}`

Elimina un artista y todas sus relaciones.

## Albumes

### Obtener todos los albumes

**GET** `/api/albums`

Devuelve una lista paginada de albumes.

### Obtener un album

**GET** `/api/albums/{id}`

Devuelve los detalles de un album especifico, incluyendo sus canciones.

### Obtener albumes de un artista

**GET** `/api/artists/{artistId}/albums`

Devuelve todos los albumes asociados a un artista.

### Crear album

**POST** `/api/albums`

Crea un nuevo album.

### Actualizar album

**PUT** `/api/albums/{id}`

Actualiza la informacion de un album existente.

### Eliminar album

**DELETE** `/api/albums/{id}`

Elimina un album y sus canciones asociadas.

## Canciones

### Obtener todas las canciones

**GET** `/api/songs`

Devuelve una lista paginada de canciones.

### Obtener una cancion

**GET** `/api/songs/{id}`

Devuelve los detalles de una cancion especifica.

### Obtener canciones de un album

**GET** `/api/albums/{albumId}/songs`

Devuelve todas las canciones de un album.

### Buscar canciones

**GET** `/api/_search/songs?query={texto}`

Busca canciones por titulo o letra.

### Crear cancion

**POST** `/api/songs`

Crea una nueva cancion en el sistema.

### Actualizar cancion

**PUT** `/api/songs/{id}`

Actualiza la informacion de una cancion existente.

### Eliminar cancion

**DELETE** `/api/songs/{id}`

Elimina una cancion del sistema.

## Listas de reproduccion

### Obtener todas las listas

**GET** `/api/playlists`

Devuelve las listas de reproduccion del usuario autenticado.

### Obtener una lista

**GET** `/api/playlists/{id}`

Devuelve los detalles de una lista de reproduccion especifica.

### Obtener listas publicas

**GET** `/api/playlists?filter=public`

Devuelve una lista de listas de reproduccion publicas.

### Crear lista

**POST** `/api/playlists`

Crea una nueva lista de reproduccion.

**Cuerpo de la peticion:**
```json
{
  "name": "Mi lista favorita",
  "description": "Una coleccion de mis canciones preferidas",
  "isPublic": true
}
```

### Actualizar lista

**PUT** `/api/playlists/{id}`

Actualiza la informacion de una lista existente.

### Eliminar lista

**DELETE** `/api/playlists/{id}`

Elimina una lista de reproduccion.

### Agregar cancion a lista

**POST** `/api/playlist-songs`

Agrega una cancion a una lista de reproduccion.

**Cuerpo de la peticion:**
```json
{
  "playlistId": 1,
  "songId": 5,
  "position": 10
}
```

### Eliminar cancion de lista

**DELETE** `/api/playlist-songs/{playlistId}/{songId}`

Elimina una cancion de una lista de reproduccion.

## Reproducciones

### Registrar reproduccion

**POST** `/api/plays`

Registra que un usuario ha reproducido una cancion.

**Cuerpo de la peticion:**
```json
{
  "songId": 5,
  "durationListened": 180
}
```

### Obtener historial de reproducciones

**GET** `/api/plays`

Devuelve el historial de reproducciones del usuario autenticado.

## Likes

### Dar like a una cancion

**POST** `/api/likes`

Agrega un like a una cancion.

**Cuerpo de la peticion:**
```json
{
  "songId": 5
}
```

### Quitar like

**DELETE** `/api/likes/{songId}`

Elimina el like de una cancion.

### Obtener canciones liked

**GET** `/api/likes`

Devuelve las canciones que el usuario autenticado ha dado like.

## Perfil de usuario

### Obtener perfil

**GET** `/api/user-profiles/{id}`

Devuelve el perfil de un usuario.

### Actualizar perfil

**PUT** `/api/user-profiles/{id}`

Actualiza el perfil del usuario autenticado.

**Cuerpo de la peticion:**
```json
{
  "bio": "Hola, soy un amante de la musica",
  "profileImage": "https://ejemplo.com/imagen.jpg"
}
```

## Seguimientos

### Seguir a un artista

**POST** `/api/user-followers`

El usuario autenticado sigue a un artista.

**Cuerpo de la peticion:**
```json
{
  "followedId": 3
}
```

### Dejar de seguir

**DELETE** `/api/user-followers/{followedId}`

El usuario autenticado deja de seguir a un artista.

### Obtener seguidores

**GET** `/api/user-followers/followers/{userId}`

Devuelve los seguidores de un usuario.

### Obtener seguidos

**GET** `/api/user-followers/following/{userId}`

Devuelve los usuarios que sigue un artista.

## Codigos de respuesta

| Codigo | Descripcion |
|--------|-------------|
| 200 | Operacion exitosa |
| 201 | Recurso creado exitosamente |
| 204 | Recurso eliminado exitosamente |
| 400 | Solicitud incorrecta |
| 401 | No autenticado |
| 403 | No autorizado |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
