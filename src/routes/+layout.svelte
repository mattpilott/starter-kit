<script lang="ts">
	import '../app.css'
	import Loader from '$components/Loader.svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
</svelte:head>

<Loader />

{@render children?.()}
