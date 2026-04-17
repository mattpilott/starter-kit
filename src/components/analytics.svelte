<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { onMount } from 'svelte'

	interface Props {
		id?: string
	}

	let { id }: Props = $props()

	function gtag(...args: Array<unknown>) {
		window.dataLayer.push(args)
	}

	onMount(() => {
		if (!id) return
		window.dataLayer = window.dataLayer || []

		gtag('js', new Date())
		gtag('config', id)
	})

	afterNavigate(({ to }) => {
		if (!id || !to) return
		gtag('config', id, {
			page_title: document.title,
			page_path: to.url.pathname
		})
	})
</script>

<svelte:head>
	{#if id}
		<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
	{/if}
</svelte:head>
