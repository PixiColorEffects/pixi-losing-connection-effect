import path from "path";

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  base: "/",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "pixi-losing-connection-effect",
      fileName: (format: string) =>
        `pixi-losing-connection-effect.${format}.js`,
    },
    minify: true,
    rollupOptions: {
      external: ["pixi.js"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default config;
