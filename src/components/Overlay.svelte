<script lang="ts">
	// This component allows a design to be overlaid on the page
	// This helps you to achieve a pixel perfect design implementation
	// It accepts 2 params for setting the desktop and mobile image paths
	// There are desktop and mobile css variables that can be used to set the design width
	// The --desktop and --mobile vars default to 1920 and 393 respectively
	// To show/hide the overlay press 1 - 9 on the keyboard. 0 = 100%, 00 = 0% opacity
	// You can shift the overlay up or down too; hold shift and press the left or right arrows
	// Additiionally for a smaller shift up or down hold ctrl alongside shift
	// Finally you can reset the overlay shift with shift + both the left & right arrows

	import { storable } from 'kitto/svelte'

	interface Props {
		mobile?: string
		desktop?: string
	}

	let { mobile = '/mobile.jpg', desktop = '/desktop.jpg' }: Props = $props()

	const msrc: string = mobile.split('@')[0]
	const dsrc: string = desktop.split('@')[0]
	const msize: string = mobile.split('@')[1] || '393'
	const dsize: string = desktop.split('@')[1] || '1920'
	const overlay = storable({ opacity: '0.0', shift: '0px' }, 'overlay')

	let innerWidth: number = $state(0)
	let innerHeight: number = $state(0)

	$effect(() => {
		document.documentElement.dataset.viewport = `${innerWidth} x ${innerHeight}`
	})

	let last_key_pressed: string | null = null
	let last_key_press_time: number = 0
	let array_keys: Set<string> = new Set()

	function keydown({
		code,
		shiftKey,
		ctrlKey,
		altKey
	}: {
		code: string
		shiftKey: boolean
		ctrlKey: boolean
		altKey: boolean
	}) {
		const now: number = Date.now()

		if (shiftKey && altKey && code === 'ArrowUp') {
			$overlay.shift = '0px'
			array_keys.clear()
			return
		}

		if (shiftKey && (code === 'ArrowDown' || code === 'ArrowUp')) {
			array_keys.add(code)

			if (array_keys.has('ArrowDown') && array_keys.has('ArrowUp')) {
				$overlay.shift = '0px'
				array_keys.clear()
			} else {
				const delta: number = code === 'ArrowDown' ? 1 : -1
				const multiplier: number = ctrlKey ? 1 : 10

				$overlay.shift = (parseInt($overlay.shift) || 0) + delta * multiplier + 'px'
			}
		} else {
			const key: string = code.replace('Digit', '')

			if (isFinite(Number(key))) {
				if (key === '0' && (ctrlKey || metaKey)) {
					return
				}
				if (key === '0') {
					$overlay.opacity = last_key_pressed === '0' && now - last_key_press_time < 500 ? '0' : '1'
				} else {
					$overlay.opacity = '0.' + key
				}
				last_key_pressed = key
				last_key_press_time = now
			}
		}
	}

	function keyup({ code }: { code: string }) {
		array_keys.delete(code)
	}
</script>

<svelte:window onkeydown={keydown} onkeyup={keyup} bind:innerHeight bind:innerWidth />

{#if desktop && $overlay.opacity !== '0'}
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
