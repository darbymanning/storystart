import type { Plugin } from "vite"
import { exec } from "child_process"

export default function regenerate_storyblok_types({
	interval_ms = 10000,
}: { interval_ms?: number } = {}): Plugin {
	let interval: ReturnType<typeof setInterval> | null = null

	return {
		name: "vite-regenerate-storyblok-types",
		configureServer() {
			console.log(
				`\x1b[33m[vite-regenerate-storyblok-types]\x1b[0m Regenerating Storyblok component types every ${interval_ms / 1000} seconds`
			)

			interval = setInterval(() => {
				exec("bun generate", (err, _stdout, stderr) => {
					if (err)
						console.error(
							"\x1b[33m[vite-regenerate-storyblok-types]\x1b[0m Error regenerating types:",
							stderr
						)
				})
			}, interval_ms)
		},
		closeBundle() {
			if (interval) {
				clearInterval(interval)
				console.log("\x1b[33m[vite-regenerate-storyblok-types]\x1b[0m Interval cleared.")
			}
		},
	}
}
