import { PUBLIC_STORYBLOK_ACCESS_TOKEN } from "$env/static/public"
import { storyblokInit, apiPlugin } from "@storyblok/svelte"
export {
	StoryblokComponent as Component,
	storyblokEditable as editable,
	useStoryblokApi as api,
	useStoryblokBridge as bridge,
} from "@storyblok/svelte"

import type { Component } from "svelte"

export async function init() {
	const components: Record<string, Component> = {}
	const modules = import.meta.glob("$lib/components/*.svelte") as Record<
		string,
		() => Promise<{ default: Component }>
	>

	for (const path in modules) {
		const name = path.split("/").pop()?.replace(".svelte", "") ?? ""
		if (!name) throw new Error(`Couldn't extract name from path: ${path}`)
		components[name] = (await modules[path]()).default
	}

	return storyblokInit({
		accessToken: PUBLIC_STORYBLOK_ACCESS_TOKEN,
		use: [apiPlugin],
		components: components as never,
	})
}
