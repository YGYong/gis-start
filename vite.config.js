import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cesium from "vite-plugin-cesium";
import { Plugin as importToCDN } from "vite-plugin-cdn-import";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium(),
    // importToCDN({
    //   modules: [
    //     {
    //       name: "draw",
    //       var: "draw",
    //       path: "https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js",
    //       css: "https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css",
    //     },
    //   ],
    // }),
  ],
});
