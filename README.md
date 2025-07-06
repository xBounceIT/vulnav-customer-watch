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

## Supabase Edge Functions

The Docker Compose stack now starts the Supabase Edge Runtime alongside the
database and frontend containers. Copy `.env.example` to `.env` and fill in your
Supabase credentials, including the service role key required by the Edge
Functions. Then run:

```sh
docker compose up --build
```

Once all containers are running you can sync the NVD database or send emails via
the UI.
