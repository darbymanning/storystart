import { dev } from "$app/environment"
import * as storyblok from "$lib/storyblok"

export async function load({ url }) {
	const version =
		dev || url.searchParams.has("_storyblok") ? ("draft" as const) : ("published" as const)

	await storyblok.init()
	const api = storyblok.api()

	return {
		api,
		version,
	}
}
