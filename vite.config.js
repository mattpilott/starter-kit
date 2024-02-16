import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { readFileSync } from 'fs'
import { composeVisitors } from 'lightningcss'
import { fluid, size, breakpoints } from './src/library/visitors'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { niceDate } from '@neuekit/utils'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))

export default defineConfig({
	build: { cssMinify: 'lightningcss' },
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			visitor: composeVisitors([
				breakpoints({
					mobile: 640,
					tablet: 1024,
					laptop: 1280,
					desktop: 1440
				}),
				fluid(1600, 16),
				size
			])
		}
	},
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version),
		'import.meta.env.build': JSON.stringify(niceDate('{DD}-{MM}-{YYYY}@{HH}:{mm}:{ss}'))
	},
	plugins: [sveltekit(), basicSsl()],
	resolve: { extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'] }
})
