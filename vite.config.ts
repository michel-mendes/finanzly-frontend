import { defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return defineConfig({
    plugins: [react()],
    base: "/finanzly-frontend",
    server: {
      host: true,
      port: 3001
    },
    define: {
      __API_BASE_URL__: JSON.stringify(env.API_BASE_URL)
    }
  })
}
