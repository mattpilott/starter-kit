<script>
	import Button from '$components/Button'
</script>

<div class="contain">
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<Button href="hello">Hello</Button>
</div>

<style>
	h1 {
		font: 600 var(--f-h1);
		size: 10px;

		@media (--from-mobile) and (--until-tablet) {
			color: blue;
		}
	}
</style>
