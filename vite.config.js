import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { readFileSync } from 'fs'
import { composeVisitors } from 'lightningcss'
import { fluid, size, breakpoints } from './src/library/visitors'
import basicSsl from '@vitejs/plugin-basic-ssl'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))

export default defineConfig({
	build: { cssMinify: 'lightningcss' },
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			customAtRules: {
				breakpoints: {
					prelude: null,
					body: 'declaration-list'
				}
			},
			drafts: { customMedia: true },
			visitor: composeVisitors([breakpoints, fluid(1600, 16), size])
		}
	},
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version)
	},
	plugins: [sveltekit(), basicSsl()],
	resolve: { extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'] }
})
