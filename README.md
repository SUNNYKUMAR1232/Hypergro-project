# Hypergro-project

## Description

Hypergro-project is a full-stack property management and recommendation platform. It allows users to register, log in, manage profiles, list properties, search/filter properties, recommend properties to others, and provides admin features for user and property management. The backend is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, with **Redis** for caching and session/token management.

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Cache/Session:** Redis
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CSRF, CORS
- **Linting/Formatting:** ESLint (flat config), Prettier
- **Other:** Docker (for MongoDB and Redis), dotenv, body-parser, morgan

## Features

- User registration, login, logout, and password reset
- JWT-based authentication and refresh tokens
- User roles (user/admin) and block/unblock functionality
- Property CRUD (Create, Read, Update, Delete) operations
- Advanced property search and filtering
- Property recommendations between users
- Admin routes for user management (block/unblock, assign roles, delete)
- Caching of property search results with Redis
- Secure HTTP headers and CSRF protection
- API error handling and logging

## Folder Structure

```plain

project/
│
├── app.ts
├── package.json
├── tsconfig.json
├── .prettierrc
├── eslint.config.js
├── docker-compose.yml
├── .env.example
├── README.md
│
├── common/
│   └── config/
│       ├── cors.config.ts
│       ├── db.config.ts
│       ├── env.config.ts
│       ├── helmet.config.ts
│       ├── morgan.config.ts
│       └── redis.config.ts
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── property.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts
│   │
│   ├── models/
│   │   ├── property.model.ts
│   │   └── user.model.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── property.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── property.service.ts
│   │   └── user.service.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   └── utils/
│       └── asyncHandler.ts
└── dist/   # Compiled JS output (ignored by git, not committed)

```

> **Note:**  
> - All TypeScript source code is under `src/`.  
> - `common/config` holds shared configuration files.  
> - `controllers` contains route handler logic.  
> - `middleware` contains Express middleware.  
> - `models` contains Mongoose schemas/models.  
> - `routes` contains Express route definitions.  
> - `services` contains business logic and data access.  
> - `types` holds custom TypeScript type definitions.  
> - `dist` is for compiled output (after `tsc`).

## Installation

1. **Clone the repository**

      ```sh

      git clone https://github.com/SUNNYKUMAR1232/Hypergro-project.git
      cd Hypergro-project

      ```

2. **Install dependencies**

      ```sh

      npm install

      ```

3. **Set up environment variables**

      Create a `.env` file in the root directory and add your configuration (see `.env.example`):

      ```env

      PORT=5000
      HOST=localhost
      MONGODB_URI=mongodb://admin:password@localhost:27017/your-db
      JWT_SECRET=your_jwt_secret
      REFRESH_SECRET=your_refresh_secret
      REDIS_URL=redis://localhost:6379

      ```

4. **Start MongoDB and Redis using Docker Compose**

      ```sh

      docker-compose up -d

      ```

5. **Build and run the server**

      ```sh

      npm run dev

      ```

6. **Lint and format code (optional)**

      ```sh

      npm run lint
      npm run format

      ```

The API will be available at [http://localhost:5000/api/v1/](http://localhost:5000/api/v1/).

Use tools like **Postman** or **Insomnia** to interact with the endpoints.

## License

MIT
