<script lang="ts">
	import '../app.css'
	import Loader from '$components/Loader.svelte'
	// import { Overlay } from 'kitto/svelte'
	// import Cookie from '$components/Cookie.svelte'
	// import { prefs } from '$library/stores'
	// import { browser } from '$app/environment'

	let { children } = $props()
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
</svelte:head>

<Loader />

{@render children?.()}
<!-- 
{#if browser && !$prefs?.cookie}
	<Cookie />
{/if} -->
