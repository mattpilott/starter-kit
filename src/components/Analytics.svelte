<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { onMount } from 'svelte'

	let { id } = $props();

	function gtag() {
		window.dataLayer.push(arguments)
	}

	onMount(() => {
		if (!id) return
		window.dataLayer = window.dataLayer || []

		gtag('js', new Date())
		gtag('config', id)
	})

	afterNavigate(({ to }) => {
		gtag('config', id, {
			page_title: document.title,
			page_path: to.url.pathname
		})
	})
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head>
