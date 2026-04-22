<script lang="ts">
	import Form from '$components/form.svelte'
	import { type TemplateProps, Block } from '$library/storyblok.js'

	let { data }: TemplateProps['Page'] = $props()
</script>

<main>
	<div class="contain">
		{#each data.story?.content.blocks as block (block._uid)}
			<Block blok={block} />
		{/each}
	</div>
	<Form />
</main>
