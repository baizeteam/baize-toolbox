import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import reactCssModule from "vite-plugin-react-css-modules";
import genericNames from "generic-names";
import autoprefixer from "autoprefixer";
import copy from "rollup-plugin-copy";

const generateScopedName = genericNames("[name]__[local]__[hash:base64:4]");

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      // copy({
      //   targets: [
      //     // 将文件夹复制到输出目录
      //     { src: "resources/mac", dest: "out" },
      //     { src: "resources/win", dest: "out" },
      //   ],
      // }),
    ],
  },
  preload: {
    // build: {
    //   rollupOptions: {
    //     input: {
    //       home: resolve(__dirname, "src/preload/index.ts"),
    //       captureWin: resolve(__dirname, "src/preload/index.ts"),
    //     },
    //   },
    // },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [
      reactCssModule({
        generateScopedName,
        filetypes: {
          ".less": {
            syntax: "postcss-less",
          },
        },
      }),
      react(),
    ],
    css: {
      modules: {
        generateScopedName,
      },
      postcss: {
        plugins: [autoprefixer],
      },
    },
  },
});
