import {
	apiPlugin,
	StoryblokComponent,
	storyblokEditable,
	storyblokInit,
	useStoryblokApi,
	useStoryblokBridge,
} from "@storyblok/svelte"

export const init = storyblokInit
export const editable = storyblokEditable
export const bridge = useStoryblokBridge
export const api = useStoryblokApi
export const api_plugin = apiPlugin
export const Component = StoryblokComponent
