import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer les erreurs de sourcemap spécifiques
        if (
          warning.message?.includes("Can't resolve original location of error")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  ssr: {
    noExternal: ["@chakra-ui/react", "@emotion/react", "@emotion/styled"],
  },
  esbuild: {
    sourcemap: false,
  },
});
