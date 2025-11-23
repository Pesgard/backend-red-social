# 📡 API Endpoints Implementados - Red Social

## 🌐 Base URL
```
http://localhost:3000
```

## 🔒 Autenticación

El sistema utiliza JWT (JSON Web Token) para autenticación.

### Headers requeridos para endpoints protegidos:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🧑‍💼 Módulo de Autenticación y Usuarios

### 1️⃣ Registro de Usuario
**POST** `/auth/register`

**Request:**
```json
{
  "first_name": "Juan",
  "last_name": "Villarreal",
  "email": "juan@example.com",
  "password": "Contra12345",
  "phone": "8123456789",
  "address": "Monterrey, NL",
  "alias": "javm",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png"
}
```

**Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "first_name": "Juan",
  "last_name": "Villarreal",
  "email": "juan@example.com",
  "alias": "javm",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png",
  "created_at": "2025-10-30T15:45:00Z",
  "token": "<jwt_token>"
}
```

---

### 2️⃣ Inicio de Sesión
**POST** `/auth/login`

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "Contra12345"
}
```

**Response (200):**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "Juan",
    "last_name": "Villarreal",
    "alias": "javm",
    "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png"
  }
}
```

---

### 3️⃣ Perfil del Usuario (Autenticado)
**GET** `/users/me`

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "first_name": "Juan",
  "last_name": "Villarreal",
  "email": "juan@example.com",
  "alias": "javm",
  "phone": "8123456789",
  "address": "Monterrey, NL",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png",
  "created_at": "2025-10-30T15:45:00Z"
}
```

---

### 4️⃣ Actualizar Perfil (Autenticado)
**PUT** `/users/me`

**Request:**
```json
{
  "alias": "javm_dev",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/101_new.png",
  "phone": "8123459999"
}
```

**Response (200):**
```json
{
  "message": "Perfil actualizado correctamente."
}
```

---

### 5️⃣ Cambiar Contraseña (Autenticado)
**PUT** `/users/me/password`

**Request:**
```json
{
  "current_password": "Contra12345",
  "new_password": "NuevaPass2025"
}
```

**Response (200):**
```json
{
  "message": "Contraseña actualizada con éxito."
}
```

---

### 6️⃣ Listar Favoritos del Usuario (Autenticado)
**GET** `/users/me/favorites`

**Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Nuevo día en el campus",
    "description": "Compartiendo una buena vista.",
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "alias": "javm",
      "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png"
    },
    "images": [
      "https://cdn.redsocialapp.com/posts/3001/img1.jpg"
    ],
    "likes": 42,
    "dislikes": 2,
    "created_at": "2025-10-25T14:00:00Z",
    "updated_at": "2025-10-28T09:30:00Z"
  }
]
```

---

## 📰 Módulo de Publicaciones

### 1️⃣ Listar Publicaciones (Autenticado)
**GET** `/posts`

**Query Parameters (opcionales):**
- `search` (string): Buscar por título o descripción
- `author` (string): Filtrar por ID del autor
- `order_by` (string): `title`, `user`, `date` (default: `date`)
- `direction` (string): `asc` o `desc` (default: `desc`)

**Ejemplo:** `/posts?search=campus&order_by=date&direction=desc`

**Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Nuevo día en el campus",
    "description": "Compartiendo una buena vista.",
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "alias": "javm",
      "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png"
    },
    "images": [
      "https://cdn.redsocialapp.com/posts/3001/img1.jpg"
    ],
    "likes": 42,
    "dislikes": 2,
    "created_at": "2025-10-25T14:00:00Z",
    "updated_at": "2025-10-28T09:30:00Z"
  }
]
```

---

### 2️⃣ Crear Publicación (Autenticado)
**POST** `/posts`

**Request:**
```json
{
  "title": "Mi primer publicación",
  "description": "Hola a todos, estrenando app 😎",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "message": "Publicación creada exitosamente."
}
```

---

### 3️⃣ Obtener Detalle de Publicación (Autenticado)
**GET** `/posts/:id`

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Nuevo día en el campus",
  "description": "Compartiendo una buena vista.",
  "author": {
    "id": "507f1f77bcf86cd799439012",
    "alias": "javm",
    "avatar_url": "https://cdn.redsocialapp.com/avatars/default.png"
  },
  "images": [
    "https://cdn.redsocialapp.com/posts/3001/img1.jpg"
  ],
  "likes": 42,
  "dislikes": 2,
  "created_at": "2025-10-25T14:00:00Z",
  "updated_at": "2025-10-28T09:30:00Z",
  "comments": [
    {
      "id": "507f1f77bcf86cd799439013",
      "user": {
        "id": "507f1f77bcf86cd799439014",
        "alias": "mariadev"
      },
      "text": "Qué buena foto!",
      "likes": 3,
      "created_at": "2025-10-25T15:00:00Z",
      "replies": [
        {
          "id": "507f1f77bcf86cd799439015",
          "user": {
            "id": "507f1f77bcf86cd799439012",
            "alias": "javm"
          },
          "text": "Gracias!",
          "created_at": "2025-10-25T15:30:00Z"
        }
      ]
    }
  ]
}
```

---

### 4️⃣ Editar Publicación (Autenticado)
**PUT** `/posts/:id`

**Request:**
```json
{
  "title": "Mi primer publicación editada",
  "description": "Actualizando el texto principal",
  "images": [
    "https://example.com/image1.jpg"
  ]
}
```

**Response (200):**
```json
{
  "message": "Publicación actualizada correctamente."
}
```

---

### 5️⃣ Eliminar Publicación (Autenticado)
**DELETE** `/posts/:id`

**Response (200):**
```json
{
  "message": "Publicación eliminada."
}
```

---

### 6️⃣ Votar Publicación (Like/Dislike) (Autenticado)
**POST** `/posts/:id/vote`

**Request:**
```json
{
  "vote": "like"
}
```

Valores válidos: `"like"` o `"dislike"`

**Response (200):**
```json
{
  "likes": 43,
  "dislikes": 2
}
```

---

## 💬 Módulo de Comentarios

### 1️⃣ Agregar Comentario a Publicación (Autenticado)
**POST** `/posts/:id/comments`

**Request:**
```json
{
  "text": "Excelente publicación!"
}
```

**Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "message": "Comentario agregado con éxito."
}
```

---

### 2️⃣ Responder a un Comentario (Autenticado)
**POST** `/comments/:id/replies`

**Request:**
```json
{
  "text": "Totalmente de acuerdo!"
}
```

**Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "message": "Respuesta publicada."
}
```

---

### 3️⃣ Dar Like a un Comentario (Autenticado)
**POST** `/comments/:id/like`

**Response (200):**
```json
{
  "message": "Like agregado al comentario."
}
```

---

## ⭐ Módulo de Favoritos

### 1️⃣ Agregar/Quitar Favorito (Autenticado)
**POST** `/posts/:id/favorite`

**Request:**
```json
{
  "favorite": true
}
```

- `true`: Agregar a favoritos
- `false`: Quitar de favoritos

**Response (200):**
```json
{
  "message": "Publicación agregada a favoritos."
}
```

---

## ⚙️ Módulo de Sincronización Offline

### 1️⃣ Sincronizar Publicaciones Offline (Autenticado)
**POST** `/sync`

**Request:**
```json
{
  "pending_posts": [
    {
      "local_id": "temp_123",
      "title": "Post offline",
      "description": "Guardado sin conexión",
      "images": ["https://example.com/image.jpg"],
      "created_at": "2025-10-30T09:00:00Z"
    }
  ]
}
```

**Response (200):**
```json
{
  "synced": [
    {
      "local_id": "temp_123",
      "server_id": "507f1f77bcf86cd799439011"
    }
  ]
}
```

---

## 🏥 Health Check

### 1️⃣ Verificar Estado del Servidor
**GET** `/health`

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T10:30:00Z"
}
```

---

## 🧰 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Error de validación o parámetros inválidos |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Sin permisos para realizar la acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email duplicado) |
| 500 | Internal Server Error | Error interno del servidor |

---

## 📝 Notas Importantes

1. **Autenticación Global**: Todos los endpoints excepto `/auth/register`, `/auth/login` y `/health` requieren autenticación JWT.

2. **Validación de IDs**: Todos los IDs de MongoDB son validados. Si se proporciona un ID inválido, se retorna un error 400.

3. **Permisos**: Solo el autor de una publicación puede editarla o eliminarla.

4. **Votos**: Un usuario puede cambiar su voto en una publicación. Si ya votó "like" y vota "dislike", se actualiza automáticamente.

5. **Favoritos**: El mismo endpoint se usa para agregar y quitar favoritos mediante el campo `favorite`.

6. **Comentarios**: Los comentarios están asociados a publicaciones y pueden tener respuestas (replies).

7. **Sincronización**: El endpoint de sync permite enviar múltiples publicaciones creadas offline de una sola vez.

---

## 🚀 Ejemplos de Uso con cURL

### Registro:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Villarreal",
    "email": "juan@example.com",
    "password": "Contra12345",
    "alias": "javm"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Contra12345"
  }'
```

### Crear Publicación (con token):
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Mi primera publicación",
    "description": "Hola mundo!"
  }'
```

---

## 🔧 Variables de Entorno Requeridas

```env
MONGODB_URI=mongodb://localhost:27017/red-social
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=7d
PORT=3000
```

---

**Última actualización:** Noviembre 13, 2025

