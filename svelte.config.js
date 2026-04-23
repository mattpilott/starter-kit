import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter(),
		alias: {
			$blocks: './src/blocks',
			$components: './src/components',
			$library: './src/library',
			$routes: './src/routes',
			$templates: './src/templates',
			$convex: './src/convex'
		}
	},
	vitePlugin: {
		inspector: true,
		dynamicCompileOptions: ({ filename }) => (filename.includes('node_modules') ? undefined : { runes: true })
	}
}
