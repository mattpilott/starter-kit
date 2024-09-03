<script>
	import { afterNavigate } from '$app/navigation'
	import { onMount } from 'svelte'

	export let id

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
			/* eslint-disable camelcase */
			page_title: document.title,
			page_path: to.url.pathname
			/* eslint-enable camelcase */
		})
	})
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head>
