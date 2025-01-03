<script lang="ts">
  import { bridge, Component } from "$LIBRARY_DIR/storyblok.js"

  let { data } = $props()
  let story = $state(data.story)

  $effect(() => {
    if (!data.story) return

    bridge(data.story.id, (new_story) => {
      story = new_story as typeof data.story
    })
  })
</script>

{#if story}
  <Component blok={story.content} />
{/if}
