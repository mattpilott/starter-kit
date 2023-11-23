import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { readFileSync } from 'fs'
import basicSsl from '@vitejs/plugin-basic-ssl'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))

export default defineConfig({
	plugins: [sveltekit(), basicSsl()],
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version)
	},
	resolve: { extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'] },
	css: {
		preprocessorOptions: {
			scss: { additionalData: `@use '$library/prepend' as *;` }
		}
	},
	build: { cssMinify: 'lightningcss' }
})
