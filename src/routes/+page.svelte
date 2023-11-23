<script>
	import Button from '$components/Button'
</script>

<div class="wrap">
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<Button href="hello">Hello</Button>
</div>

<style lang="scss">
	.wrap {
		@extend %wrap;
	}
</style>
