# Backend-ING-software

API REST hecha con **Node.js + Express + MongoDB (Mongoose)** 

Permite registrar usuarios, iniciar sesión (devuelve un **JWT**) y administrar un CRUD de tareas protegido con **Bearer Token**. Cada usuario solo puede ver, modificar y eliminar **sus propias** tareas.

## Instalación

```bash
git clone https://github.com/Maurici0o/Backend-JWT-Tareas.git
cd Backend-JWT-Tareas/backend
npm install
```

Crea un archivo `.env` dentro de la carpeta `backend/` (usa `.env.example` como guía):

```env
NODE_ENV=development
PORT=5000
MONGO_DB=<cadena de conexión a MongoDB>
JWT_SECRET=<un secreto largo y aleatorio>
```

## Ejecución

```bash
npm start        # node backend/server.js
npm run server   # con nodemon (recarga automática)
```

El servidor queda en `http://localhost:5000`.

## Endpoints

| Método | Ruta | Descripción | ¿Requiere token? |
|--------|------|-------------|------------------|
| POST | `/api/users` | Crear usuario (`name`, `email`, `password`) | No |
| POST | `/api/users/login` | Iniciar sesión y devolver el JWT (`email`, `password`) | No |
| GET | `/api/users/datos` | Datos del usuario dueño del token | Sí |
| GET | `/api/tareas` | Listar solo las tareas del usuario logueado | Sí |
| POST | `/api/tareas` | Crear una tarea (`descripcion`) | Sí |
| PUT | `/api/tareas/:id` | Modificar una tarea propia (`descripcion`) | Sí |
| DELETE | `/api/tareas/:id` | Eliminar una tarea propia | Sí |

Para las rutas protegidas se envía el header:

```
Authorization: Bearer <token>
```

Sin token o con token inválido la API responde `401 Unauthorized`.

## Seguridad

- El id del usuario sale siempre del token (`req.user`), nunca del body ni de la URL.
- Cada tarea guarda el id de su dueño y todas las consultas filtran por ese id.
- Si un usuario intenta modificar o eliminar una tarea ajena, la API responde `404` y la tarea no cambia.
- Las contraseñas se guardan con hash (`bcrypt`).
