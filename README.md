# Welcome to CVEAdvisor

## How can I edit this code?

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/xBounceIT/vulnav-customer-watch.git

# Step 2: Navigate to the project directory.
cd vulnav-customer-watch

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start Supabase locally. The app expects a running Supabase instance
# so you need to start it before launching the dev server. You can use Docker
# Compose (included in this repo) or the Supabase CLI.
docker compose up supabase   # or: npx supabase start

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

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

