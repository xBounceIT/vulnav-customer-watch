# Welcome to CVEAdvisor

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Running with Docker Compose

1. Copy `.env.example` to `.env` and adjust the Supabase credentials if needed.
2. Start the stack:

```sh
docker compose up --build
```

The app will be available on `http://localhost:8080`.

You can deploy the application using Docker Compose:

```sh
# Build the Docker image and start the container in the background
docker compose up --build -d
```

The application will be reachable at [http://localhost:8080](http://localhost:8080).

