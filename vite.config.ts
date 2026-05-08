import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Base is set for GitHub Pages deployment to repository path
// Update the path if your repository name changes
export default defineConfig({
  base: "/PersonalTrainerFrontEnd/",
  plugins: [react()],
});
