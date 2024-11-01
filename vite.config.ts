import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "custom-build-log",
      buildStart() {
        const startTime = new Date().toLocaleTimeString();
        console.log(`🚀 Build starting at ${startTime}...`);
      },
      buildEnd() {
        const endTime = new Date().toLocaleTimeString();
        console.log(`🎉 Build finished at ${endTime}!`);
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@layout": path.resolve(__dirname, "./src/layout"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@services": path.resolve(__dirname, "./src/services"),
      "/tinymce": path.resolve(__dirname, "node_modules/tinymce")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("@src/app")) {
            return "app";
          }
          if (id.includes("@src/components")) {
            return "components";
          }
          if (id.includes("@src/context")) {
            return "context";
          }
          if (id.includes("@src/const")) {
            return "const";
          }
          if (id.includes("@src/utils")) {
            return "utils";
          }
          if (id.includes("@src/routes")) {
            return "routes";
          }
          if (id.includes("@src/hooks")) {
            return "hooks";
          }
          if (id.includes("@src/pages")) {
            return "pages";
          }
          if (id.includes("@src/layout")) {
            return "layout";
          }
          if (id.includes("@src/models")) {
            return "models";
          }
          if (id.includes("@src/services")) {
            return "services";
          }
        }
      }
    },
    chunkSizeWarningLimit: 10000
  }
});
