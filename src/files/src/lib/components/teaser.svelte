<script lang="ts">
	import type { Blok, TeaserStoryblok } from "$lib/schema"
	import { editable } from "$lib/storyblok"

	interface Props {
		blok: Blok<TeaserStoryblok>
	}

	let { blok }: Props = $props()
</script>

<h2 use:editable={blok} class="py-32 text-center text-6xl font-bold text-[#50b0ae]">
	{blok.headline}
</h2>
