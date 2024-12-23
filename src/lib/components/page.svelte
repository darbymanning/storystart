<script lang="ts">
	import type { Blok, PageStoryblok } from "$lib/schema"
	import { Component, editable } from "$lib/storyblok"

	interface Props {
		blok: Blok<PageStoryblok>
	}

	let props: Props = $props()
</script>

{#key props.blok}
	<div use:editable={props.blok} class="px-6">
		{#if props.blok.body?.length}
			{#each props.blok.body as blok}
				<Component {blok} />
			{/each}
		{/if}
	</div>
{/key}
