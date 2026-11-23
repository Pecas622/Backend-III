# Backend III – Entrega Final (Santiago Zorrilla)

API REST en Node.js + Express + MongoDB (Mongoose) con autenticación JWT, módulo de productos/carritos, **mascotas y adopciones**, documentación con **Swagger**, tests funcionales con **Mocha + Chai + Supertest** y una imagen de **Docker** publicada en Docker Hub.

## 🐳 Imagen en Docker Hub

**https://hub.docker.com/r/pecas622/backend-iii**

```bash
docker pull pecas622/backend-iii:latest
```

## Requisitos

- Node.js 22+ y npm (para correr sin Docker)
- Docker (para correr con la imagen)
- Una base MongoDB (por ejemplo, MongoDB Atlas)

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

| Variable     | Descripción                               | Ejemplo                       |
|--------------|-------------------------------------------|-------------------------------|
| `PORT`       | Puerto del servidor                       | `8080`                        |
| `MONGO_URI`  | Cadena de conexión a MongoDB              | `mongodb+srv://user:pass@...` |
| `JWT_SECRET` | Secreto para firmar los tokens JWT        | `un_secreto_largo`            |

El archivo `.env` **no** se copia a la imagen (está en `.dockerignore`); las variables se pasan al ejecutar el contenedor.

## Ejecutar con Docker (imagen de Docker Hub)

```bash
docker run -d --name backend-iii -p 8080:8080 \
  -e MONGO_URI="mongodb+srv://<usuario>:<password>@<cluster>/<base>" \
  -e JWT_SECRET="un_secreto_largo" \
  pecas622/backend-iii:latest
```

O usando tu archivo `.env`:

```bash
docker run -d --name backend-iii -p 8080:8080 --env-file .env pecas622/backend-iii:latest
```

Luego abrí:

- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/docs

Para ver los logs o frenar el contenedor:

```bash
docker logs -f backend-iii
docker stop backend-iii && docker rm backend-iii
```

## Construir la imagen localmente

El `Dockerfile` parte de `node:22-alpine`, instala solo las dependencias de producción con `npm ci` (usando `package-lock.json`, así el build es reproducible), copia el proyecto, corre como usuario sin privilegios y expone el puerto `8080`.

```bash
docker build -t pecas622/backend-iii:1.0.0 -t pecas622/backend-iii:latest .
# o bien
npm run docker:build
```

Probar la imagen construida:

```bash
npm run docker:run    # docker run --rm -p 8080:8080 --env-file .env pecas622/backend-iii:latest
```

Subirla a Docker Hub:

```bash
docker login
npm run docker:push   # sube los tags 1.0.0 y latest
```

## Ejecutar sin Docker

```bash
npm install
cp .env.example .env   # y completar los valores
npm run dev            # modo desarrollo (con --watch)
npm start              # modo producción
```

## Tests

```bash
npm test
```

Los tests usan **mongodb-memory-server**: levantan una base MongoDB temporal en memoria, así que no tocan tu base real ni necesitan `.env`. La primera ejecución descarga el binario de MongoDB (puede tardar un poco). Si preferís usar otra base de prueba, definí `MONGO_URI_TEST`.

| Archivo                  | Qué cubre                                                         |
|--------------------------|-------------------------------------------------------------------|
| `test/adoption.test.js`  | Todos los endpoints de `adoption.router.js`, casos de éxito y error |
| `test/users.test.js`     | Registro, login y endpoints de `/api/users`                       |

Casos cubiertos en `adoption.router.js`:

| Endpoint                          | Éxito                                                   | Error                                                    |
|-----------------------------------|---------------------------------------------------------|----------------------------------------------------------|
| `GET /api/adoptions`              | 200 con lista vacía y con datos                         | –                                                        |
| `GET /api/adoptions/:aid`         | 200 con la adopción                                      | 404 inexistente, 400 id inválido                         |
| `POST /api/adoptions/:uid/:pid`   | 201, la mascota queda adoptada y asignada al usuario     | 400 ya adoptada, 404 usuario o mascota inexistente, 400 ids inválidos |

## Documentación (Swagger)

Disponible en **`/api/docs`**. Incluye los módulos **Users** (`src/docs/users.doc.yaml`), **Pets** y **Adoptions** (`src/docs/adoptions.doc.yaml`), y **Auth** (comentarios en `src/routers/api/auth.api.js`).

Para probar los endpoints protegidos de Users: hacé login en `POST /api/auth/login`, copiá el `token` de la respuesta y cargalo con el botón **Authorize** (bearerAuth).

## Endpoints principales

| Método | Ruta                          | Descripción                              |
|--------|-------------------------------|------------------------------------------|
| POST   | `/api/auth/register`          | Registrar usuario                        |
| POST   | `/api/auth/login`             | Login, devuelve token JWT (y cookie)     |
| GET    | `/api/users`                  | Perfil del usuario logueado              |
| PUT    | `/api/users`                  | Actualizar usuario logueado              |
| DELETE | `/api/users`                  | Eliminar usuario logueado                |
| GET    | `/api/pets`                   | Listar mascotas                          |
| POST   | `/api/pets`                   | Crear mascota                            |
| GET    | `/api/pets/:pid`              | Ver mascota                              |
| DELETE | `/api/pets/:pid`              | Eliminar mascota                         |
| GET    | `/api/adoptions`              | Listar adopciones                        |
| GET    | `/api/adoptions/:aid`         | Ver adopción                             |
| POST   | `/api/adoptions/:uid/:pid`    | El usuario `uid` adopta la mascota `pid` |

## Estructura

```
├── Dockerfile
├── .dockerignore
├── index.js                 # conecta a Mongo y levanta el servidor
├── src/
│   ├── app.js               # app de Express (la importan los tests)
│   ├── controllers/
│   ├── dao/                 # modelos y managers de Mongoose
│   ├── docs/                # documentación Swagger en YAML
│   ├── helpers/
│   ├── middlewares/
│   └── routers/api/         # adoption.router.js, pets.router.js, users.api.js, ...
└── test/
    ├── hooks.js             # base MongoDB en memoria para los tests
    ├── adoption.test.js
    └── users.test.js
```
