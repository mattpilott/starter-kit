<script>
	import '../app.css'
	import { prefs } from '$library/stores'
	import { dev } from '$app/environment'
	import { inject } from '@vercel/analytics'
	import Analytics from '$components/Analytics'
	import Cookie from '$components/Cookie'
	import Loader from '$components/Loader'
	import { onMount } from 'svelte'

	!dev && inject({ mode: dev ? 'development' : 'production' })

	let mounted = false

	onMount(() => (mounted = true))
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
</svelte:head>

<Loader />

<slot />

<!-- {#if $prefs.cookie === undefined && mounted}
	<Cookie />
{/if}

{#if !dev && $prefs.cookie}
	<Analytics id="G-XXXXXXXXXX" />
{/if} -->
