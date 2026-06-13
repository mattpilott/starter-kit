<script lang="ts">
	import favicon from '$library/assets/favicon.svg'
	import '../app.css'
	import Loader from '$components/loader.svelte'
	// import { Overlay } from 'kitto/svelte'
	// import Cookie from '$components/cookie.svelte'
	// import { prefs } from '$library/stores'
	// import { browser } from '$app/environment'

	let { children } = $props()
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
	<link rel="icon" href={favicon} />
</svelte:head>

<Loader />

{@render children?.()}
<!-- 
{#if browser && !$prefs?.cookie}
	<Cookie />
{/if} -->
