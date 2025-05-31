# Hypergro-project

## Description

Hypergro-project is a full-stack property management and recommendation platform. It allows users to register, log in, manage profiles, list properties, search/filter properties, recommend properties to others, and provides admin features for user and property management. The backend is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, with **Redis** for caching and session/token management.

## Tech Stack

### Backend Technologies

- **Node.js** (v18.x or higher)
- **Express.js** (v4.x) - Web framework
- **TypeScript** (v5.x) - Type-safe JavaScript
- **MongoDB** (v6.x) - NoSQL database
- **Redis** (v7.x) - In-memory data store for caching
- **Mongoose** (v7.x) - MongoDB object modeling

### Security & Performance

- **JWT** - JSON Web Tokens for authentication
- **Helmet** - Security headers
- **CSRF Protection** - Cross-Site Request Forgery protection
- **CORS** - Cross-Origin Resource Sharing
- **Redis** - Session management and caching
- **Morgan** - HTTP request logger

### Development Tools

- **ESLint** (flat config) - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization
- **dotenv** - Environment variables
- **body-parser** - Request body parsing
- **morgan** - HTTP request logging

## Features

### Authentication & Authorization

- Secure user registration with email validation
- JWT-based authentication with refresh tokens
- Role-based access control (user/admin)
- Password reset functionality
- Account blocking/unblocking
- Session management with Redis

### Property Management

- Complete CRUD operations for properties
- Advanced search with multiple filters:
  - Price range
  - Location
  - Property type
  - Features (amenities)
  - Number of bedrooms/bathrooms
- Property recommendations system
- Image upload and management
- Property status tracking

### User Management

- Profile management
- User preferences
- Favorite properties

### Performance & Security

- Redis caching for frequently accessed data
- XSS protection
- SQL injection prevention
- Secure password hashing
- API request logging

## Project Structure

```plain
project/
│
├── app.ts                 # Application entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .prettierrc           # Prettier code formatting rules
├── eslint.config.js      # ESLint configuration
├── docker-compose.yml    # Docker services configuration
├── .env.example          # Example environment variables
├── README.md             # Project documentation
│
├── common/               # Shared configurations
│   └── config/
│       ├── cors.config.ts    # CORS settings
│       ├── db.config.ts      # MongoDB connection
│       ├── env.config.ts     # Environment variables
│       ├── helmet.config.ts  # Security headers
│       ├── morgan.config.ts  # Request logging
│       └── redis.config.ts   # Redis connection
│
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── property.controller.ts # Property operations
│   │   └── user.controller.ts    # User management
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts    # Authentication checks
│   │   ├── error.middleware.ts   # Error handling
│   │   └── validation.middleware.ts # Request validation
│   │
│   ├── models/          # Database models
│   │   ├── property.model.ts     # Property schema
│   │   └── user.model.ts         # User schema
│   │
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts        # Auth endpoints
│   │   ├── property.routes.ts    # Property endpoints
│   │   └── user.routes.ts        # User endpoints
│   │
│   ├── services/        # Business logic
│   │   ├── auth.service.ts       # Auth operations
│   │   ├── property.service.ts   # Property operations
│   │   └── user.service.ts       # User operations
│   │
│   ├── types/           # TypeScript types
│   │   ├── express.d.ts          # Express type extensions
│   │   └── models.d.ts           # Model interfaces
│   │
│   └── utils/           # Helper functions
│       ├── asyncHandler.ts       # Async error handling
│       ├── logger.ts             # Logging utility
│       └── validators.ts         # Input validation
│
└── dist/                # Compiled JavaScript (git-ignored)
```

## Installation

### Prerequisites

- Node.js (v18.x or higher)
- Docker and Docker Compose
- Git
- MongoDB (if not using Docker)
- Redis (if not using Docker)

### Step-by-Step Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/SUNNYKUMAR1232/Hypergro-project.git
   cd Hypergro-project
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=5000
   HOST=localhost
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://admin:password@localhost:27017/your-db
   MONGODB_USER=admin
   MONGODB_PASS=password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   REFRESH_SECRET=your_refresh_token_secret
   REFRESH_EXPIRES_IN=7d

   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   REDIS_PASSWORD=your_redis_password

   # Security
   CORS_ORIGIN=http://localhost:3000

   ```

4. **Start Services with Docker**

   ```sh
   docker-compose up -d
   ```

   This will start:
   - MongoDB on port 27017
   - Redis on port 6379

5. **Build and Run**

   ```sh
   # Development mode with hot-reload
   npm run dev

   # Production build
   npm run build
   npm start
   ```

6. **Development Tools**

   ```sh
   # Lint code
   npm run lint

   # Format code
   npm run format

   # Run tests
   npm test
   ```

### Environment Variables Explained

| Variable          | Description               | Default     | Required |
| ----------------- | ------------------------- | ----------- | -------- |
| PORT              | Server port               | 5000        | No       |
| HOST              | Server host               | localhost   | No       |
| NODE_ENV          | Environment               | development | No       |
| MONGODB_URI       | MongoDB connection string | -           | Yes      |
| JWT_SECRET        | JWT signing key           | -           | Yes      |
| REFRESH_SECRET    | Refresh token secret      | -           | Yes      |
| REDIS_URL         | Redis connection URL      | -           | Yes      |

## API Documentation

## API Routes Documentation

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint          | Description             | Auth Required |
| ------ | ----------------- | ----------------------- | ------------- |
| POST   | `/register`       | Register new user       | No            |
| POST   | `/login`          | User login              | No            |
| POST   | `/refresh`        | Refresh access token    | Yes           |
| POST   | `/reset/initiate` | Initiate password reset | No            |
| POST   | `/reset/confirm`  | Confirm password reset  | No            |

### Property Routes (`/api/v1/properties`)

| Method | Endpoint       | Description          | Auth Required | Middleware                         |
| ------ | -------------- | -------------------- | ------------- | ---------------------------------- |
| POST   | `/`            | Create new property  | Yes           | authenticate                       |
| GET    | `/`            | Get all properties   | No            | -                                  |
| GET    | `/search`      | Search properties    | No            | -                                  |
| GET    | `/:id`         | Get property by ID   | No            | -                                  |
| PUT    | `/:id`         | Update property      | Yes           | authenticate, isblocked, isOwner   |
| PUT    | `/addUser/:id` | Add user to property | Yes           | authenticate, isblocked, isOwner   |
| DELETE | `/:id`         | Delete property      | Yes           | authenticate, isblocked, adminOnly |
| POST   | `/recommend`   | Recommend property   | Yes           | authenticate                       |

### User Routes (`/api/v1/users`)

| Method | Endpoint           | Description              | Auth Required | Middleware              |
| ------ | ------------------ | ------------------------ | ------------- | ----------------------- |
| GET    | `/profile`         | Get user profile         | Yes           | authenticate            |
| PUT    | `/profile`         | Update user profile      | Yes           | authenticate, adminOnly |
| PUT    | `/block/:id`       | Block/unblock user       | Yes           | authenticate, adminOnly |
| PUT    | `/role/:id`        | Assign user role         | Yes           | authenticate, adminOnly |
| DELETE | `/delete/:id`      | Delete user              | Yes           | authenticate, adminOnly |
| POST   | `/logout`          | User logout              | Yes           | authenticate            |
| GET    | `/`                | Get all users            | Yes           | authenticate            |
| GET    | `/recommendations` | Get user recommendations | Yes           | authenticate            |

### Middleware Functions

1. **authenticate**
   - Verifies JWT token
   - Attaches user object to request
   - Required for protected routes

2. **isblocked**
   - Checks if user is blocked
   - Prevents blocked users from accessing certain routes

3. **isOwner**
   - Verifies if user owns the resource
   - Used for property updates and deletions

4. **adminOnly**
   - Restricts access to admin users only
   - Used for administrative operations

5. **asyncHandler**
   - Wraps async route handlers
   - Provides consistent error handling

### Error Handling

All routes return errors in a consistent format:

```json
{
    "success": false,
    "data": null,
    "message": "Forbidden",
    "code": 403,
    "timestamp": "2025-05-31T13:13:32.932Z"
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Format code with Prettier
- Use async/await for asynchronous operations
- Implement proper error handling
- Write meaningful comments

### Git Workflow

1. Create feature branch from `main`
2. Make changes and commit
3. Push to remote
4. Create pull request
5. Code review
6. Merge to `main`

### Testing

- Write unit tests for services
- Integration tests for API endpoints
- Use Jest as testing framework
- Maintain good test coverage

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service is running
   - Verify connection string in .env
   - Ensure network connectivity

2. **Redis Connection Error**
   - Check Redis service is running
   - Verify Redis URL in .env
   - Check Redis password if set

3. **JWT Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

4. **Port Already in Use**
   - Check if another process is using the port
   - Change PORT in .env
   - Kill the process using the port

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
