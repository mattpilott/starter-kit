<script>
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	export let id

	onMount(() => {
		if (id) {
			const googleAnalytics = document.createElement('script')
			googleAnalytics.src = `https://www.googletagmanager.com/gtag/js?id=${id}`

			document.body.append(googleAnalytics)
			window.dataLayer = window.dataLayer || []

			function gtag() {
				window.dataLayer.push(arguments)
			}

			gtag('js', new Date())
			gtag('config', id)
		}
	})

	$: {
		if (typeof gtag !== 'undefined' && id) {
			gtag('config', id, {
				page_title: document.title,
				page_path: $page.url.pathname
			})
		}
	}
</script>
