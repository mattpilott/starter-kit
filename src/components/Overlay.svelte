<script>
	import { browser } from '$app/environment'
	import { storable } from '@neuekit/utils'

	export let mobile = '/mobile.jpg'
	export let desktop = '/desktop.jpg'

	const msrc = mobile.split('@')[0]
	const dsrc = desktop.split('@')[0]
	const msize = mobile.split('@')[1] || 393
	const dsize = desktop.split('@')[1] || 1920
	const overlay = storable({ opacity: '0.0', shift: 0 }, 'overlay')

	let innerWidth = 0
	let innerHeight = 0

	$: browser && (document.documentElement.dataset.viewport = `${innerWidth} x ${innerHeight}`)

	function keydown({ code, shiftKey }) {
		const key = code.replace('Digit', '')
		if (shiftKey && isFinite(key)) {
			$overlay.shift = `-${key}0px`
		} else if (isFinite(key)) {
			$overlay.opacity = '0.' + key
		}
	}
</script>

<svelte:window on:keydown={keydown} bind:innerHeight bind:innerWidth />

{#if desktop && $overlay.opacity !== '0.0'}
	<picture class="overlay" style="--mobile:{msize}px; --desktop:{dsize}px">
		<source srcset={dsrc || msrc} media="(min-width: 640px)" />
		<img
			class="img"
			style:opacity={$overlay.opacity}
			style:margin-top={$overlay.shift}
			src={msrc || dsrc}
			alt="Overlay"
		/>
	</picture>
{/if}

<style>
	.overlay {
		display: block;
		height: auto;
		max-width: 100%;
		overflow: hidden;
		pointer-events: none;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 100;
	}

	.img {
		left: 50%;
		max-width: none;
		opacity: 0;
		position: relative;
		transition:
			opacity 0.3s ease,
			margin-top 0.3s ease;
		transform: translateX(-50%);
		width: var(--mobile, 393px);
	}
	@media (min-width: 640px) {
		.img {
			width: var(--desktop, 1920px);
		}
	}
</style>
