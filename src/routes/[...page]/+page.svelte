<script lang="ts">
	import { client } from '$library/storyblok.js'

	let { data: _data } = $props()

	const data = $derived(client.connect(_data.story))
	const Template = $derived(client.template(_data.story))
</script>

{#if data.story?.content && Template}
	<Template {data} />
{/if}
