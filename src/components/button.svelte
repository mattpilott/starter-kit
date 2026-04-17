<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		href?: string
		onclick?: (event: MouseEvent) => void
		children?: Snippet
	}

	let { href, onclick, children }: Props = $props()
</script>

<svelte:element this={href ? 'a' : 'button'} class="button" {href} {onclick} role={href ? 'link' : 'button'}>
	{@render children?.()}
</svelte:element>

<style lang="css">
	.button {
		display: inline-block;
	}
</style>
