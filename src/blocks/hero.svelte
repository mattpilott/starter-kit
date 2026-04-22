<script lang="ts">
	import type { Blok, Hero } from '$library/components.schema.build.js'
	import Richtext from '$components/richtext.svelte'
	import { attrs } from '$library/storyblok.js'
	import { image } from '$library/image.js'

	interface Props {
		blok: Blok<Hero>
	}

	let { blok }: Props = $props()
</script>

<section {...attrs(blok)}>
	{#if image.exists(blok.image)}
		<img {...image(blok.image, { width: 500, height: 500 })} />
	{/if}
	<Richtext content={blok.title} />
</section>

<style>
	section {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 3rem;
		align-items: center;
		padding-block: 3rem;
	}
</style>
