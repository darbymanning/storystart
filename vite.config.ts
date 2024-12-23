import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import basic_ssl from "@vitejs/plugin-basic-ssl"
import regenerate_storyblok_types from "./scripts/plugin"

export default defineConfig({
	plugins: [sveltekit(), basic_ssl(), regenerate_storyblok_types()],
})
