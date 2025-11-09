import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/BerserkerLog",
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
