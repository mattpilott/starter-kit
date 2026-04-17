<script lang="ts">
	let { href = undefined, onclick = undefined, children } = $props()
</script>

<svelte:element this={href ? 'a' : 'button'} class="button" {href} {onclick} role={href ? 'link' : 'button'}>
	{@render children?.()}
</svelte:element>

<style lang="css">
	.button {
		display: inline-block;
	}
</style>
