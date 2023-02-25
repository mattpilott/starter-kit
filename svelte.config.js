import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { readFileSync } from 'fs'

const prependData = readFileSync(new URL('src/library/prepend.scss', import.meta.url), 'utf8')

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components',
			$library: './src/library'
		}
	},
	preprocess: preprocess.scss({ renderSync: true, prependData })
}
