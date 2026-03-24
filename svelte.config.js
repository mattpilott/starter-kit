import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components',
			$library: './src/library'
		}
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) => (filename.includes('node_modules') ? undefined : { runes: true })
	}
}
