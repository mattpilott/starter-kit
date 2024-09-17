<script>
	import Button from '$components/Button.svelte'
</script>

<div class="contain foo">
	<h1 class="bar">Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<Button href="hello">Hello</Button>
</div>

<style lang="css">
	.foo {
		color: blue;

		.bar {
			color: red;
		}
	}
	h1 {
		font: 600 var(--f-h1);

		@media (--from-mobile) and (--until-tablet) {
			color: red;
		}
	}
</style>
