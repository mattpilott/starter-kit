import adapter from '@sveltejs/adapter-cloudflare'

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter({ runtime: 'edge' }),
		alias: {
			$components: './src/components',
			$library: './src/library'
		}
	}
}
