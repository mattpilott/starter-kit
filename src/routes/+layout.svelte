<script>
	import '../app.scss'
	import { prefs } from '$library/stores'
	import { dev } from '$app/environment'
	import Analytics from '$components/Analytics'
	import Cookie from '$components/Cookie'
	import Loader from '$components/Loader'
	import { onMount } from 'svelte'

	let mounted = false

	onMount(() => (mounted = true))
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
</svelte:head>

<Loader />

<slot />

{#if $prefs.cookie === undefined && mounted}
	<Cookie />
{/if}

{#if !dev && $prefs.cookie}
	<Analytics id="G-XXXXXXXXXX" />
{/if}
