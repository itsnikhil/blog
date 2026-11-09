import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
export default defineConfig({
 site: "https://itsnikhil.github.io", base: "/blog",
 output: "static", trailingSlash: "always",
 integrations: [icon()], vite: { plugins: [tailwind()] },
});
