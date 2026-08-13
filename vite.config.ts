import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Read the same PORT the API uses so the proxy target can never drift from it.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = env.PORT ?? "8787";

  return {
    root: "web",
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": `http://localhost:${apiPort}`,
      },
    },
  };
});
