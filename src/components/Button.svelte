<script>
	export let href = undefined
</script>

<svelte:element this={href ? 'a' : 'button'} {href} on:click role={href ? 'link' : 'button'}>
	<slot />
</svelte:element>
