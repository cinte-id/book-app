# Book Tracker App Frontend

A modern React application for managing your reading list, built with Vite, TypeScript, and shadcn/ui.

## ## DevOps Submission Notes

**Chosen Role:** DevOps (Junior)

This contribution containerizes the **frontend** (React + Vite) application using Docker, including a multi-stage Dockerfile, Docker Compose setup, environment variable handling, and a CI workflow with GitHub Actions.

**How to run/test:** See the [Running with Docker](#running-with-docker) section below.

**Notes & technical decisions:**
- Chose to containerize the **frontend** (over backend).
- Used a **multi-stage Dockerfile**: Stage 1 (`node:20-alpine`) installs dependencies and runs `vite build`; Stage 2 (`nginx:alpine`) only serves the built static      files. This keeps the final image small, since Node.js, `node_modules`, and source code are discarded after the build stage.
- Added a custom `nginx.conf` to handle SPA routing. Without it, refreshing the page on any route other than `/` (e.g. `/library`) would return a 404, since Nginx would look for a physical file that doesn't exist. The config falls back to `index.html` so React Router can handle routing on the client side.
- Vite environment variables (`VITE_*`) are baked in at **build time**, not runtime. To avoid hardcoding values in the image, `ARG` is used to receive values via `--build-arg`, then passed into `ENV` so they're available during the `RUN npm run build` step. `docker-compose.yml` reads these values from a local `.env` file (not committed; already covered by `.gitignore`).
- Chose **npm** over **Bun** (the repo includes both `package-lock.json` and `bun.lockb`) since npm is more universally available in any Node base image without extra setup.


## Features

- 📚 Add, view, update, and delete books
- 📖 Track reading status (unread/reading/completed)
- 🎨 Modern and responsive UI with Tailwind CSS
- 🔄 Real-time updates
- ⚡ Fast and efficient with React + Vite
- 🛡️ Type-safe with TypeScript

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- ESLint
- PostCSS

## GitHub Actions CI

This project includes a GitHub Actions workflow that automatically runs whenever code is pushed to the `main` branch. The workflow helps ensure that the Docker configuration remains valid and that the application can always be built successfully.

| CI Step | Description |
|---------|-------------|
| **Checkout repository** | Downloads the latest version of the project into the GitHub Actions runner. |
| **Lint Dockerfile** | Uses Hadolint to validate the Dockerfile and check for Docker best practices. |
| **Set up Docker Buildx** | Configures Docker Buildx to support modern Docker image builds. |
| **Build Docker image** | Builds the frontend Docker image to verify that the application can be containerized successfully. |

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── data/          # Data and mock files
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── App.tsx        # Main React component
│   ├── App.css        # App-specific styles
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── tailwind.config.ts # Tailwind configuration
├── components.json    # shadcn/ui configuration
├── postcss.config.js  # PostCSS configuration
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── package.json       # Frontend dependencies
```

## Prerequisites

- Node.js 16.x or later
- npm or yarn

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Running with Docker

The app is containerized with a multi-stage `Dockerfile`: the first stage builds the static assets with Vite, and the second stage serves them with a lightweight Nginx image (configured for SPA client-side routing).

### Build the image

Vite environment variables (`VITE_*`) are baked in at build time, so they are passed in as `--build-arg`, sourced from a `.env` file — never hardcoded in the Dockerfile or image layers.

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:5001 \
  --build-arg VITE_API_BASE_URL=http://localhost:5001/api \
  --build-arg VITE_APP_TITLE="Book Tracker App" \
  -t book-app-frontend .
```

### Run the container

```bash
docker run -d -p 8080:80 book-app-frontend
```

The app will be available at http://localhost:8080

### Run with Docker Compose (recommended)

1. Create a `.env` file in this folder (see `env.example` for the required variables).
2. Start the stack:

```bash
docker compose up -d --build
```

Compose automatically reads `.env` and passes the values as build args, so no environment-specific values are hardcoded in the image.

## Development

### Component Structure
- Use functional components with TypeScript
- Implement proper type definitions
- Follow shadcn/ui component patterns

### State Management
- Use React hooks for local state
- Implement custom hooks for shared logic
- Consider context for global state

### Styling
- Use Tailwind CSS classes
- Follow shadcn/ui design system
- Maintain consistent spacing and colors

### Type Safety
- Define interfaces for all data structures
- Use TypeScript strict mode
- Implement proper error handling

## Configuration Files

### tailwind.config.ts
- Tailwind CSS configuration
- Custom theme settings
- Plugin configurations

### components.json
- shadcn/ui component configuration
- Style and theme settings

### tsconfig.json
- TypeScript configuration
- Path aliases
- Compiler options

### vite.config.ts
- Vite bundler configuration
- Plugin settings
- Build options

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Authentication system
- [ ] Search and filtering
- [ ] Sorting options
- [ ] Book categories/tags
- [ ] Reading progress tracking
- [ ] Book ratings and reviews
- [ ] User profiles and personal libraries

## License

This project is licensed under the MIT License - see the LICENSE file for details.
