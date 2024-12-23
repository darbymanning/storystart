import { dev } from "$app/environment"
import { PUBLIC_STORYBLOK_ACCESS_TOKEN } from "$env/static/public"
import teaser from "$lib/components/teaser.svelte"
import page from "$lib/components/page.svelte"
import grid from "$lib/components/grid.svelte"
import feature from "$lib/components/feature.svelte"
import * as storyblok from "$lib/storyblok"

export async function load({ url }) {
	const version =
		dev || url.searchParams.has("_storyblok") ? ("draft" as const) : ("published" as const)

	storyblok.init({
		accessToken: PUBLIC_STORYBLOK_ACCESS_TOKEN,
		use: [storyblok.api_plugin],
		components: {
			teaser,
			page,
			grid,
			feature,
		} as never,
	})

	const api = storyblok.api()

	return {
		api,
		version,
	}
}
