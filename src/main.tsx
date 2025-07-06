import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const REQUIRED_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const

const missing = REQUIRED_VARS.filter(
  (key) => !import.meta.env[key]
)

const rootEl = document.getElementById('root')!

if (missing.length > 0) {
  const MissingEnv = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md p-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
        <p>The following environment variables are missing:</p>
        <ul className="list-disc list-inside">
          {missing.map((v) => (
            <li key={v} className="text-red-700">
              <code>{v}</code>
            </li>
          ))}
        </ul>
        <p>Please define them and restart the application.</p>
      </div>
    </div>
  )
  createRoot(rootEl).render(<MissingEnv />)
} else {
  createRoot(rootEl).render(<App />)
}
