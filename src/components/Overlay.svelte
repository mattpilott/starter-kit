<script>
	// This component allows a design to be overlaid on the page
	// This helps you to achieve a pixel perfect design implementation
	// It accepts 2 params for setting the desktop and mobile image paths
	// There are desktop and mobile css variables that can be used to set the design width
	// The --desktop and --mobile vars default to 1920 and 393 respectively
	// To show/hide the overlay press 1 - 9 on the keyboard. 0 = 100%, 00 = 0% opacity
	// You can shift the overlay up or down too; hold shift and press the left or right arrows
	// Additiionally for a smaller shift up or down hold ctrl alongside shift
	// Finally you can reset the overlay shift with shift + both the left & right arrows

	import { browser } from '$app/environment'
	import { storable } from 'kitto/svelte'

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

	let lastKeyPress = null
	let lastKeyPressTime = 0
	let arrowKeys = new Set()

	function keydown({ code, shiftKey, ctrlKey }) {
		const now = Date.now()

		if (shiftKey && (code === 'ArrowLeft' || code === 'ArrowRight')) {
			arrowKeys.add(code)

			if (arrowKeys.has('ArrowLeft') && arrowKeys.has('ArrowRight')) {
				$overlay.shift = '0px'
				arrowKeys.clear()
			} else {
				const delta = code === 'ArrowLeft' ? 1 : -1
				const multiplier = ctrlKey ? 1 : 10

				$overlay.shift = (parseInt($overlay.shift) || 0) + delta * multiplier + 'px'
			}
		} else {
			const key = code.replace('Digit', '')

			if (isFinite(key)) {
				if (key === '0') {
					$overlay.opacity = lastKeyPress === '0' && now - lastKeyPressTime < 500 ? '0' : '1'
				} else {
					$overlay.opacity = '0.' + key
				}
				lastKeyPress = key
				lastKeyPressTime = now
			}
		}
	}

	function keyup({ code }) {
		arrowKeys.delete(code)
	}
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} bind:innerHeight bind:innerWidth />

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
		overflow: clip;
		pointer-events: none;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 1000;
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
