import { UserConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import replace from "@rollup/plugin-replace"
import fs from "fs"

/**
  mode: "development",
  base: "/",
  registerType: process.env.CLAIMS === "true" ? "autoUpdate" : undefined,
*/

const config: UserConfig = {
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === "true",
  },
  plugins: [
    Vue(),
    VitePWA({
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"], // <== don't add slash, for testing
      manifest: {
        name: "Open-Chess",
        short_name: "Open-Chess",
        description: "Open Source Chess app",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png", // <== don't add slash, for testing
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png", // <== don't remove slash, for testing
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png", // <== don't add slash, for testing
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    replace({
      __DATE__: new Date().toISOString(),
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync("src/static/dev/cert/99733967_localhost.key"),
      cert: fs.readFileSync("src/static/dev/cert/99733967_localhost.cert"),
    },
  },
}

export default config
