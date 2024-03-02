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

  // Ping the server every 14 minutes to keep it up
  if (env.FRONTEND_URL) {
    pingServer(`${env.API_BASE_URL}/ping`, env.FRONTEND_URL)

    setInterval(() => {
      pingServer(`${env.API_BASE_URL}/ping`, env.FRONTEND_URL)
    }, 840000)
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


// Helper function
async function pingServer(apiUrl: string, origin: string) {
  try {
    await (await fetch(apiUrl, { headers: { origin } })).text()
  } catch (error: any) {
    console.log(`Error sending ping to server: "${error}"`)
  }
}