<script lang="ts">
	import '../app.css'
	import Loader from '$components/loader.svelte'
	import Metatags from '$components/metatags.svelte'
	// import { Overlay } from 'kitto/svelte'
	// import Cookie from '$components/cookie.svelte'
	// import { prefs } from '$library/stores'
	// import { browser } from '$app/environment'

	let { children, data } = $props()
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
</svelte:head>

<Metatags />

<Loader />

<header>
	<div class="contain">
		<a href="/">{data.layout.content.site_name}</a>
	</div>
</header>

{@render children?.()}

<!--
{#if browser && !$prefs?.cookie}
	<Cookie />
{/if} -->

<style>
	header {
		border-bottom: 2px solid var(--c-black);
	}

	.contain {
		padding-block: 2rem;
		font: 600 var(--f-h5);
	}
</style>
