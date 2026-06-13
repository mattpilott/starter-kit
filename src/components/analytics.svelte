<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { prefs } from '$library/stores'

	interface Props {
		id?: string
	}

	let { id }: Props = $props()

	let initialised = false

	function gtag(...args: Array<unknown>) {
		window.dataLayer.push(args)
	}

	// Load + init GA only once consent is granted (reacts if the user accepts later).
	$effect(() => {
		if (!id || $prefs.cookies !== true || initialised) return
		initialised = true
		window.dataLayer = window.dataLayer || []
		gtag('js', new Date())
		gtag('config', id) // counts the page that was open when consent was granted
	})

	// Track client-side navigations; skip the initial load (no `from`) — config already counted it.
	afterNavigate(({ from, to }) => {
		if (!id || $prefs.cookies !== true || !from || !to) return
		gtag('event', 'page_view', {
			page_title: document.title,
			page_path: to.url.pathname
		})
	})
</script>

<svelte:head>
	{#if id && $prefs.cookies === true}
		<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
	{/if}
</svelte:head>
