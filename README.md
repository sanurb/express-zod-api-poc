<div align="center">

# Express Zod API POC

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express Zod API](https://img.shields.io/badge/Express%20Zod%20API-25.5.3-purple.svg)](https://github.com/RobinTail/express-zod-api)
[![Zod](https://img.shields.io/badge/Zod-4.1.12-blue.svg)](https://zod.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)

**A comprehensive CRUD API for cat management built with Express Zod API, featuring type-safe validation, automatic documentation generation, and clean architecture.**

</div>

## ✨ Features

- 🚀 **Express Zod API** with type-safe validation and automatic documentation
- 🐱 **Cat Management CRUD API** with in-memory storage
- 📚 **Auto-generated Documentation** (OpenAPI 3.1, TypeScript client, Schema docs)
- 🔧 **Environment validation** with Zod and dotenv
- 🏗️ **Clean Architecture** with vertical slicing and screaming architecture
- 🎯 **Type-safe** end-to-end with Zod schemas
- 📊 **Comprehensive logging** with Consola
- 🛠️ **Development tools** with hot reload and linting
- 🎨 **Clean code** with Biome formatter and linter
- 🔒 **Git hooks** with Lefthook
- ⚡ **Fast development** with pnpm and TypeScript watch mode
- 🌍 **Production-ready** with environment detection

## 🏗️ Architecture

```
src/
├── cats/                   # Cat management feature (vertical slicing)
│   ├── domain/            # Domain layer
│   │   ├── cat.schema.ts  # Zod schemas and types
│   │   ├── cat.types.ts   # TypeScript type definitions
│   │   └── cat.constants.ts # Business constants
│   ├── infrastructure/    # Infrastructure layer
│   │   └── cat.repository.ts # In-memory repository
│   ├── application/       # Application layer
│   │   └── cat.service.ts # Business logic
│   ├── controllers/       # Presentation layer
│   │   ├── create_cat.controller.ts
│   │   ├── get_cat.controller.ts
│   │   ├── get_all_cats.controller.ts
│   │   ├── update_cat.controller.ts
│   │   └── delete_cat.controller.ts
│   └── routes.ts          # Route configuration
├── health/                # Health check feature
│   ├── health.controller.ts
│   └── routes.ts
├── docs/                  # Documentation generation
│   ├── generator.ts       # OpenAPI and client generators
│   └── index.ts          # Documentation exports
├── scripts/               # Utility scripts
│   └── generate-docs.ts   # Documentation generation script
├── config/                # Configuration management
│   ├── index.ts          # Singleton configuration
│   ├── env.schema.ts     # Environment validation schema
│   └── types.ts         # TypeScript type definitions
└── index.ts             # Application entry point
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/sanurb/express-zod-api-poc.git
cd express-zod-api-poc

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000

# Application Configuration
APP_NAME=My Backend API
```

## 🚀 Usage

### Development

```bash
# Start TypeScript compiler in watch mode
pnpm run dev:tsc

# Start Node.js with hot reload
pnpm run dev:node

# Run both commands simultaneously
pnpm run dev
```

### Production

```bash
# Build the project
pnpm run build

# Start production server
node dist/index.js
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format
```

## 🔧 Configuration

The application uses a singleton pattern for configuration management with environment validation:

```typescript
import { GlobalConfig } from "./config/index.js";

// Access configuration
const port = GlobalConfig.port;
const appName = GlobalConfig.appInfo;
const fullConfig = GlobalConfig.config;
```

### Environment Variables

| Variable   | Type   | Default         | Description                      |
| ---------- | ------ | --------------- | -------------------------------- |
| `PORT`     | number | `3000`          | Server port (1-65535)            |
| `APP_NAME` | string | `"Backend API"` | Application name (max 100 chars) |

## 🛠️ Tech Stack

### Core Dependencies

- **[Express.js](https://expressjs.com/)** - Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Zod](https://zod.dev/)** - Schema validation
- **[TSTL](https://github.com/samchon/tstl)** - C++ STL for TypeScript
- **[Consola](https://github.com/unjs/consola)** - Elegant console logger
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variables
- **[std-env](https://github.com/unjs/std-env)** - Environment detection

### Development Tools

- **[Biome](https://biomejs.dev/)** - Fast formatter and linter
- **[Ultracite](https://github.com/sanurb/ultracite)** - Code quality tool
- **[Lefthook](https://github.com/evilmartians/lefthook)** - Git hooks manager
- **[Lens.js](https://github.com/lensjs/lens)** - Application monitoring

## 📊 API Endpoints

### System Endpoints

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| `GET`  | `/`              | API information and endpoints |
| `GET`  | `/api/v1/health` | Health check endpoint         |
| `GET`  | `/docs`          | Scalar API documentation      |

### Cat Management Endpoints

| Method   | Endpoint           | Description                   |
| -------- | ------------------ | ----------------------------- |
| `GET`    | `/api/v1/cats`     | List all cats with pagination |
| `POST`   | `/api/v1/cats`     | Create a new cat              |
| `GET`    | `/api/v1/cats/:id` | Get a specific cat by ID      |
| `PUT`    | `/api/v1/cats/:id` | Update a specific cat         |
| `DELETE` | `/api/v1/cats/:id` | Delete a specific cat         |

### Example Requests

**Create a Cat**

```bash
curl -X POST http://localhost:3000/api/v1/cats \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Whiskers",
    "age": 3,
    "breed": "Persian",
    "color": "White",
    "isAdopted": false
  }'
```

**Get All Cats**

```bash
curl http://localhost:3000/api/v1/cats?page=1&limit=10
```

**Get Specific Cat**

```bash
curl http://localhost:3000/api/v1/cats/123e4567-e89b-12d3-a456-426614174000
```

## 📚 Documentation Generation

This project includes comprehensive documentation generation capabilities:

### Available Documentation

- **OpenAPI 3.1 Specification** - Complete API documentation
- **TypeScript Client** - Type-safe client code generation
- **Schema Documentation** - Markdown docs generated from Zod schemas
- **Scalar Documentation** - Interactive API documentation at `/docs`

### Generate Documentation

```bash
# Generate all documentation
pnpm run docs:all

# Generate only OpenAPI specification
pnpm run docs:openapi

# Generate only TypeScript client
pnpm run docs:client

# Generate only schema documentation
pnpm run docs:schemas
```

### Documentation Features

- **Type Safety**: Full TypeScript support with compile-time type checking
- **Validation**: Automatic request/response validation using Zod schemas
- **Examples**: Comprehensive examples and descriptions
- **Tagging**: Proper endpoint categorization and organization
- **Clean Architecture**: Documentation follows SOLID principles

## 🎯 Development Workflow

1. **Clone** the repository
2. **Install** dependencies with `pnpm install`
3. **Configure** environment variables
4. **Start** development with `pnpm run dev`
5. **Test** the API endpoints with the provided examples
6. **Generate** documentation with `pnpm run docs:all`
7. **View** interactive docs at `http://localhost:3000/docs`
8. **Code** with hot reload and type checking
9. **Lint** and format with `pnpm run lint` and `pnpm run format`

## 🔒 Code Quality

This project enforces strict code quality standards:

- **Type Safety**: Full TypeScript coverage with strict mode
- **Code Style**: Biome formatter and linter
- **Git Hooks**: Pre-commit hooks with Lefthook
- **Clean Code**: Following clean code principles
- **Accessibility**: A11y best practices
- **Performance**: Optimized for development and production

## 📝 Scripts

| Script          | Description                                     |
| --------------- | ----------------------------------------------- |
| `dev`           | Start development server (TypeScript + Node.js) |
| `dev:tsc`       | TypeScript compiler in watch mode               |
| `dev:node`      | Node.js with hot reload                         |
| `lint`          | Lint code with Ultracite                        |
| `format`        | Format code with Ultracite                      |
| `docs:generate` | Generate OpenAPI spec and TypeScript client     |
| `docs:openapi`  | Generate only OpenAPI specification             |
| `docs:client`   | Generate only TypeScript client                 |
| `docs:schemas`  | Generate schema documentation with zod2md       |
| `docs:all`      | Generate all documentation                      |

## 🌍 Environment Detection

The application automatically detects the environment:

- **Development**: Full logging with Consola and hot reload
- **Production**: Optimized performance with minimal logging
- **Environment variables**: Validated on startup with detailed error messages

## 🚀 Performance Features

- **Express Zod API** with automatic validation and type safety
- **In-memory storage** for fast CRUD operations
- **Singleton pattern** for configuration (loaded once)
- **Lazy loading** of environment variables
- **Type-safe** configuration access
- **Production optimizations** with environment detection
- **Fast development** with hot reload and watch mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express Zod API](https://github.com/RobinTail/express-zod-api) for the type-safe API framework
- [Express.js](https://expressjs.com/) for the web framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Zod](https://zod.dev/) for schema validation
- [zod2md](https://github.com/matejchalk/zod2md) for schema documentation generation
- [Scalar](https://scalar.com/) for interactive API documentation
- [Biome](https://biomejs.dev/) for code formatting and linting

---

<div align="center">

**⭐ Star this repository if you found it useful! ⭐**

[Source](https://github.com/sanurb/express-zod-api-poc) • [Issues](https://github.com/sanurb/express-zod-api-poc/issues) • [License](LICENSE)

</div>
