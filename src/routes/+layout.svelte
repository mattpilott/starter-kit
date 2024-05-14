<script>
	import '../app.css'
	import Loader from '$components/Loader.svelte'
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
</svelte:head>

<Loader />

<slot />
