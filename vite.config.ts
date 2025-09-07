import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer les warnings de sourcemap
        if (warning.code === "SOURCEMAP_ERROR") {
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
