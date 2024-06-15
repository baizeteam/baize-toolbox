import { resolve } from "path"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import react from "@vitejs/plugin-react"
import reactCssModule from "vite-react-stylename"
import genericNames from "generic-names"
import autoprefixer from "autoprefixer"

const generateScopedName = genericNames("[name]__[local]__[hash:base64:4]")

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@resources": resolve("resources"),
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
        "@siteMain": resolve("src/renderer/siteMain/src"),
        "@siteAssistOpaque": resolve("src/renderer/siteAssistOpaque/src"),
        "@siteAssistTransprent": resolve("src/renderer/siteAssistTransprent/src"),
        "@siteElectronLoading": resolve("src/renderer/siteElectronLoading/src"),
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
        generateScopedName: generateScopedName,
      },
      postcss: {
        plugins: [autoprefixer],
      },
      preprocessorOptions: {
        less: {
          additionalData: `@import '@renderer/assets/styles/theme.less';`,
          javascriptEnabled: true,
        },
      },
    },
    build: {
      minify: "terser",
      cssMinify: "esbuild",
      rollupOptions: {
        input: {
          siteMain: resolve(__dirname, "src/renderer/siteMain/index.html"),
          siteAssistTransprent: resolve(__dirname, "src/renderer/siteAssistTransprent/index.html"),
          siteAssistOpaque: resolve(__dirname, "src/renderer/siteAssistOpaque/index.html"),
          siteElectronLoading: resolve(__dirname, "src/renderer/siteElectronLoading/index.html"),
        },
        output: {
          manualChunks: {
            reactBase: ["react", "react-dom"],
            reactEcology: ["react-router-dom", "mobx", "mobx-react"],
            tools: ["ahooks", "lodash", "nanoid"],
            // antd: ["antd"],
          },
        },
      },
    },
  },
})
