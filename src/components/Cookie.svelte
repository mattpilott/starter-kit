<script lang="ts">
	import { prefs } from '$library/stores'
	import Button from '$components/Button.svelte'
	import { slide, fly } from 'svelte/transition'

	let details = $state(false)
</script>

<div class="cookie" in:fly={{ y: 50 }} out:fly={{ y: 50 }}>
	<div class="title">This site uses cookies to measure and improve your experience.</div>
	{#if details}
		<div class="details" transition:slide>
			We use cookies to improve your experience.<br />"Essential" cookies are needed for the site to function.
			<dl>
				<dt>Essential</dt>
				<dd>Online support</dd>
				<dd>Country preference</dd>
				<dd>Cookie preference</dd>
				<dt>Analysis / Tracking</dt>
				<dd>Google Analytics</dd>
			</dl>
		</div>
	{/if}
	<Button onclick={() => ($prefs.cookie = false)}>Opt-out</Button>
	<Button onclick={() => (details = !details)}>Details</Button>
	<div></div>
	<Button onclick={() => ($prefs.cookie = true)}>Accept</Button>
</div>

<style>
	.cookie {
		background-color: white;
		border-radius: var(--r-14);
		box-shadow: 0 10px 40px hsl(0 0% 0% / 0.2);
		display: grid;
		gap: 0 2rem;
		grid-template-columns: auto auto 1fr auto;
		inset: auto auto 0.5rem 0.5rem;
		max-width: min(48ch, 100% - 1rem);
		padding: 2rem;
		position: fixed;
		z-index: 1;

		/* @include mq($from: tablet) {
			inset: auto auto 1rem 1rem;
		} */
	}

	.title {
		grid-column: 1 / -1;
		font: 500 var(--f-body);
		margin-bottom: 1rem;
	}

	.details {
		color: black;
		grid-column: 1 / -1;
	}
</style>
