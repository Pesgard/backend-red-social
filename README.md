🔒 Autenticación

El sistema utiliza token JWT en cada request autenticado.

Headers comunes:
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json


Módulo de Usuarios
1️⃣ Registro de Usuario
POST /auth/register

Descripción: Crea un nuevo usuario.

Request
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

Response
{
  "id": 101,
  "first_name": "Juan",
  "last_name": "Villarreal",
  "email": "juan@example.com",
  "alias": "javm",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/101.png",
  "created_at": "2025-10-30T15:45:00Z",
  "token": "<jwt_token>"
}

Códigos de Respuesta

201 Created → Usuario creado exitosamente

400 Bad Request → Campos inválidos o correo duplicado


2️⃣ Inicio de Sesión
POST /auth/login

Descripción: Autentica al usuario y devuelve el token.

Request
{
  "email": "juan@example.com",
  "password": "Contra12345"
}

Response
{
  "token": "<jwt_token>",
  "user": {
    "id": 101,
    "first_name": "Juan",
    "last_name": "Villarreal",
    "alias": "javm",
    "avatar_url": "https://cdn.redsocialapp.com/avatars/101.png"
  }
}

Perfil del Usuario
GET /users/me

Devuelve la información del usuario logueado.

Response
{
  "id": 101,
  "first_name": "Juan",
  "last_name": "Villarreal",
  "email": "juan@example.com",
  "alias": "javm",
  "phone": "8123456789",
  "address": "Monterrey, NL",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/101.png",
  "created_at": "2025-10-30T15:45:00Z"
}

4️⃣ Actualizar Perfil
PUT /users/me

Actualiza datos del usuario autenticado.

Request
{
  "alias": "javm_dev",
  "avatar_url": "https://cdn.redsocialapp.com/avatars/101_new.png",
  "phone": "8123459999"
}

Response
{
  "message": "Perfil actualizado correctamente."
}

5️⃣ Cambiar Contraseña
PUT /users/me/password
{
  "current_password": "Contra12345",
  "new_password": "NuevaPass2025"
}

Response
{
  "message": "Contraseña actualizada con éxito."
}

📰 Módulo de Publicaciones
1️⃣ Listar Publicaciones
GET /posts

Query Params opcionales:

Param	Tipo	Descripción
search	string	Buscar por título o descripción
author	string	Filtrar por alias del usuario
order_by	string	title, user, date
direction	string	asc o desc
Response
[
  {
    "id": 3001,
    "title": "Nuevo día en el campus",
    "description": "Compartiendo una buena vista.",
    "author": {
      "id": 101,
      "alias": "javm",
      "avatar_url": "https://cdn.redsocialapp.com/avatars/101.png"
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

2️⃣ Crear Publicación
POST /posts
Request
{
  "title": "Mi primer publicación",
  "description": "Hola a todos, estrenando app 😎",
  "images": [
    "base64_encoded_image_1",
    "base64_encoded_image_2"
  ]
}

Response
{
  "id": 3002,
  "message": "Publicación creada exitosamente."
}

3️⃣ Editar Publicación
PUT /posts/{id}
{
  "title": "Mi primer publicación editada",
  "description": "Actualizando el texto principal",
  "images": [
    "base64_encoded_image_1"
  ]
}

Response
{
  "message": "Publicación actualizada correctamente."
}

4️⃣ Eliminar Publicación
DELETE /posts/{id}
{
  "message": "Publicación eliminada."
}

5️⃣ Obtener Detalle de Publicación
GET /posts/{id}
{
  "id": 3001,
  "title": "Nuevo día en el campus",
  "description": "Compartiendo una buena vista.",
  "author": {
    "id": 101,
    "alias": "javm",
    "avatar_url": "https://cdn.redsocialapp.com/avatars/101.png"
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
      "id": 501,
      "user": {
        "id": 202,
        "alias": "mariadev"
      },
      "text": "Qué buena foto!",
      "likes": 3,
      "created_at": "2025-10-25T15:00:00Z",
      "replies": [
        {
          "id": 502,
          "user": { "id": 101, "alias": "javm" },
          "text": "Gracias!",
          "created_at": "2025-10-25T15:30:00Z"
        }
      ]
    }
  ]
}

6️⃣ Likes / Dislikes
POST /posts/{id}/vote
{
  "vote": "like"  // valores posibles: "like", "dislike"
}

Response
{
  "likes": 43,
  "dislikes": 2
}

💬 Módulo de Comentarios
1️⃣ Agregar Comentario
POST /posts/{id}/comments
{
  "text": "Excelente publicación!"
}

Response
{
  "id": 601,
  "message": "Comentario agregado con éxito."
}

2️⃣ Responder Comentario
POST /comments/{id}/replies
{
  "text": "Totalmente de acuerdo!"
}

Response
{
  "id": 602,
  "message": "Respuesta publicada."
}

3️⃣ Like a Comentario
POST /comments/{id}/like
{
  "message": "Like agregado al comentario."
}

⭐ Módulo de Favoritos
1️⃣ Agregar / Quitar de Favoritos
POST /posts/{id}/favorite
{
  "favorite": true
}

Response
{
  "message": "Publicación agregada a favoritos."
}

2️⃣ Listar Favoritos
GET /users/me/favorites

Devuelve las publicaciones marcadas como favoritas.

⚙️ Módulo de Sincronización Offline
POST /sync

Descripción: Envía publicaciones locales pendientes para sincronizar con el servidor.

Request
{
  "pending_posts": [
    {
      "local_id": "temp_123",
      "title": "Post offline",
      "description": "Guardado sin conexión",
      "images": ["base64_image"],
      "created_at": "2025-10-30T09:00:00Z"
    }
  ]
}

Response
{
  "synced": [
    { "local_id": "temp_123", "server_id": 3010 }
  ]
}

🧰 Errores Comunes
Código	Significado	Ejemplo
400	Error de validación	Campos faltantes
401	No autorizado	Token inválido o expirado
404	No encontrado	ID inexistente
500	Error interno	Fallo del servidor