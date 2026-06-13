<script lang="ts">
	import '../app.css'
	import favicon from '$library/assets/favicon.svg'
	import og from '$library/assets/og.png'
	import Loader from '$components/loader.svelte'
	import Seo from '$components/seo.svelte'
	import Cookie from '$components/cookie.svelte'
	// import { Overlay } from 'kitto/svelte'

	let { children } = $props()
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
	<link rel="icon" href={favicon} />
</svelte:head>

<Seo name="Starter Kit" description="An opinionated SvelteKit starter kit" image={og} locale="en_GB" />
<Loader />
{@render children?.()}
<Cookie />
