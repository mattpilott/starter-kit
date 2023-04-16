<script>
	export let href
</script>

<svelte:element this={href ? 'a' : 'button'} {href}>
	<slot />
</svelte:element>
