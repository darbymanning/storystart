import { $ } from "bun"
import { appendFile } from "node:fs/promises"

const storystart_ascii = String.raw`
 __ _                       _             _
/ _\ |_ ___  _ __ _   _ ___| |_ __ _ _ __| |_
\ \| __/ _ \| '__| | | / __| __/ _' | '__| __|
_\ \ || (_) | |  | |_| \__ \ || (_| | |  | |_
\__/\__\___/|_|   \__, |___/\__\__,_|_|   \__|
                  |___/
`
console.log(`\x1b[36m${storystart_ascii}\x1b[0m`)

await $`bun add bun-promptx -D`.quiet()
const { createSelection: selection, createPrompt: prompt } = await import("bun-promptx")

async function check_and_handle_env_files(): Promise<void> {
	const env_files_exist = (await $`test -f .env.local`.nothrow().quiet()).exitCode === 0

	if (env_files_exist) {
		const reinstall =
			selection([{ text: "Yes" }, { text: "No" }], {
				headerText:
					"It looks like you've already installed the project. Would you like to reinstall?",
			}).selectedIndex === 0

		if (reinstall) {
			await $`rm -rf .env.local`
		} else {
			console.log("👋 Goodbye!")
			process.exit(0)
		}
	}
}

async function setup_env_files(): Promise<void> {
	type EnvVars = "public_access_token" | "space_id" | "personal_access_token"

	const env_vars = new Map<EnvVars, string | null>()

	console.log("Please provide the following information to set up your environment:\n")

	env_vars.set(
		"public_access_token",
		prompt("Public access token (for the specific space): ", { required: true }).value
	)

	if (!env_vars.get("public_access_token")) {
		console.log("Please provide a public access token.")
		process.exit(1)
	}

	console.log("\nThis is the Storyblok personal access token you can generate here:")
	console.log("\x1b[35mhttps://app.storyblok.com/#/me/account?tab=token\x1b[0m")
	env_vars.set("personal_access_token", prompt("Personal access token: ", { required: true }).value)
	env_vars.set("space_id", prompt("Space ID: ", { required: true }).value)

	await appendFile(
		".env.local",
		`
# Used on client and server to access Storyblok API
PUBLIC_STORYBLOK_ACCESS_TOKEN="${env_vars.get("public_access_token")}"

# Used in the generate script to create types for Storyblok components
STORYBLOK_SPACE_ID="${env_vars.get("space_id")}"
STORYBLOK_PERSONAL_ACCESS_TOKEN="${env_vars.get("personal_access_token")}"
`.trimStart()
	)
}

await check_and_handle_env_files()
await setup_env_files()

console.log("\n📦 Installing dependencies")

await $`bun i`.quiet()

await $`open raycast://confetti`.nothrow().quiet()
console.log("\n🚀 Project setup complete!\n")

console.log("To start the development server, run:")
console.log("\x1b[35mbun dev\x1b[0m")

process.exit(0)
