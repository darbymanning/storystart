<script lang="ts">
	import type { Blok, GridStoryblok } from "$lib/schema"
	import { Component, editable } from "$lib/storyblok"

	interface Props {
		blok: Blok<GridStoryblok>
	}

	let props: Props = $props()
</script>

<div
	use:editable={props.blok}
	class="container mx-auto grid place-items-center gap-16 md:grid-cols-3"
>
	{#if props.blok.columns?.length}
		{#each props.blok.columns as blok}
			<div class="flex-auto px-6">
				<Component {blok} />
			</div>
		{/each}
	{/if}
</div>
