<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import { Tween } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	let showLoadingBar = $state(false)

	const progress = new Tween(0, {
		duration: 3500, // The time it takes to move between values
		easing: cubicOut // The easing function to use
	})

	beforeNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname) {
			showLoadingBar = true
			progress.set(0.7)
		}
	})

	afterNavigate(() => {
		progress.set(1, { duration: 500 })

		setTimeout(() => {
			showLoadingBar = false
			progress.set(0, { duration: 0 })
		}, 600)
	})
</script>

{#if showLoadingBar}
	<div class="progress">
		<div class="bar" style="width: {progress.current * 100}%"></div>
	</div>
{/if}

<style>
	.progress {
		background-color: var(--c-black);
		height: 0.125rem;
		position: fixed;
		top: 0;
		width: 100%;
		will-change: transform;
		z-index: 2000;
	}

	.bar {
		background-color: hsl(225 73% 57%);
		height: 100%;
	}
</style>
