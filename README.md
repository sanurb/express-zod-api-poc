<div align="center">

# Express ESM Skeleton

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-black.svg)](https://expressjs.com/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)

**A modern, type-safe Express.js skeleton with ESM support, environment validation, monitoring, and development tools.**

</div>

## ✨ Features

- 🚀 **Express.js 5.1.0** with TypeScript support
- 📦 **ESM (ES Modules)** support out of the box
- 🔧 **Environment validation** with Zod and dotenv
- 🏗️ **Singleton configuration** pattern with TSTL
- 🎯 **Type-safe** configuration management
- 📊 **Application monitoring** with Lens.js (development only)
- 🛠️ **Development tools** with hot reload and linting
- 🎨 **Clean code** with Biome formatter and linter
- 🔒 **Git hooks** with Lefthook
- ⚡ **Fast development** with pnpm and TypeScript watch mode
- 🌍 **Production-ready** with environment detection

## 🏗️ Architecture

```
src/
├── config/                 # Configuration management
│   ├── index.ts           # Singleton configuration
│   ├── env.schema.ts      # Environment validation schema
│   └── types.ts          # TypeScript type definitions
├── shared/                # Shared utilities
│   └── core/
│       └── constants/     # HTTP constants
│           ├── http_status.ts
│           ├── http_headers.ts
│           └── mime_types.ts
└── index.ts              # Application entry point
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/sanurb/express-esm-skeleton.git
cd express-esm-skeleton

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

| Method | Endpoint  | Description                       |
| ------ | --------- | --------------------------------- |
| `GET`  | `/`       | Basic API information             |
| `GET`  | `/health` | Health check endpoint             |
| `GET`  | `/lens`   | Application monitoring (dev only) |

### Example Responses

**GET /**

```json
{
  "message": "Express server is running!"
}
```

**GET /health**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Monitoring & Observability

### Lens.js Integration

This project includes **Lens.js** for application monitoring and observability:

- **Request & Response tracking** in development mode
- **Performance monitoring** and metrics
- **Error tracking** and debugging
- **Real-time application insights**

Lens.js is automatically enabled in development mode and provides a monitoring dashboard at `/lens`.

### Production Considerations

- Lens.js is **automatically disabled** in production
- Environment detection using `std-env`
- Clean production logs without monitoring overhead

## 🎯 Development Workflow

1. **Clone** the repository
2. **Install** dependencies with `pnpm install`
3. **Configure** environment variables
4. **Start** development with `pnpm run dev`
5. **Monitor** your application with Lens.js at `/lens`
6. **Code** with hot reload and type checking
7. **Lint** and format with `pnpm run lint` and `pnpm run format`

## 🔒 Code Quality

This project enforces strict code quality standards:

- **Type Safety**: Full TypeScript coverage with strict mode
- **Code Style**: Biome formatter and linter
- **Git Hooks**: Pre-commit hooks with Lefthook
- **Clean Code**: Following clean code principles
- **Accessibility**: A11y best practices
- **Performance**: Optimized for development and production

## 📝 Scripts

| Script     | Description                                     |
| ---------- | ----------------------------------------------- |
| `dev`      | Start development server (TypeScript + Node.js) |
| `dev:tsc`  | TypeScript compiler in watch mode               |
| `dev:node` | Node.js with hot reload                         |
| `lint`     | Lint code with Ultracite                        |
| `format`   | Format code with Ultracite                      |

## 🌍 Environment Detection

The application automatically detects the environment:

- **Development**: Full monitoring with Lens.js
- **Production**: Optimized performance without monitoring overhead
- **Environment variables**: Validated on startup with detailed error messages

## 🚀 Performance Features

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

- [Express.js](https://expressjs.com/) for the web framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Zod](https://zod.dev/) for schema validation
- [Lens.js](https://github.com/lensjs/lens) for application monitoring
- [Biome](https://biomejs.dev/) for code formatting and linting

---

<div align="center">

**⭐ Star this repository if you found it useful! ⭐**

[Source](https://github.com/sanurb/express-esm-skeleton) • [Issues](https://github.com/sanurb/express-esm-skeleton/issues) • [License](LICENSE)

</div>
