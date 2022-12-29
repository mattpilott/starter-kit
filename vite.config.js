import { sveltekit } from '@sveltejs/kit/vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version)
	},
	resolve: {
		alias: {
			$components: resolve('./src/components'),
			$library: resolve('./src/library')
		},
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte']
	},
	ssr: {
		// noExternal: ['@neuekit/utils']
	}
}

export default config
