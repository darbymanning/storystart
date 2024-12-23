<script lang="ts">
	import type { Blok, FeatureStoryblok } from "$lib/schema"
	import { editable } from "$lib/storyblok"

	interface Props {
		blok: Blok<FeatureStoryblok>
	}

	let { blok }: Props = $props()
</script>

<div use:editable={blok} class="w-full rounded-[5px] bg-[#f7f6fd] p-12 text-center">
	<h3 class="text-2xl font-bold text-[#1d243d]">{blok.name}</h3>
</div>
