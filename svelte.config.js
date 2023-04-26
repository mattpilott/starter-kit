import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import autoprefixer from 'autoprefixer'
import { readFileSync } from 'fs'
import { vitePreprocess } from '@sveltejs/kit/vite'

const prependData = readFileSync(new URL('src/library/prepend.scss', import.meta.url), 'utf8')

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter({ runtime: 'edge' }),
		alias: {
			$components: './src/components',
			$library: './src/library'
		}
	},
	preprocess: [
		preprocess({
			scss: { renderSync: true, prependData },
			postcss: { plugins: autoprefixer() }
		}),
		vitePreprocess()
	]
}
