import { defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  // Terminate app if missing "API_BASE_URL" environment var
  if (!env.API_BASE_URL) {
    console.log("Missing environment variable 'API_BASE_URL' or '.env' file containing 'API_BASE_URL'")
    process.exit()
  }

  return defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: 3001
    },
    define: {
      __API_BASE_URL__: JSON.stringify(env.API_BASE_URL)
    }
  })
}
