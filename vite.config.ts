import devtools_json from 'vite-plugin-devtools-json'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, createLogger } from 'vite'
import { readFileSync, existsSync } from 'fs'
import { composeVisitors } from 'lightningcss'
import { format_date } from 'kitto'
import { breakpoints, fluid, size } from 'kitto/lightningcss'
import { redirects, schema } from 'storyloco/vite'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))
const key_url = new URL('localhost-key.pem', import.meta.url)
const cert_url = new URL('localhost.pem', import.meta.url)
const has_https_files = existsSync(key_url) && existsSync(cert_url)
const logger = createLogger()
const logger_warn = logger.warn

logger.warn = (msg, options) => {
	// Ignore CSS warnings about global styles
	if (msg.includes('vite:css') && msg.includes("'global'")) return
	logger_warn(msg, options)
}

if (!has_https_files) logger.warn('[vite] HTTPS cert/key not found; starting dev server without https.')

export default defineConfig({
	build: { cssMinify: 'lightningcss' },
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			drafts: { customMedia: true },
			visitor: composeVisitors([
				breakpoints({
					mobile: 640,
					tablet: 1024,
					laptop: 1280,
					desktop: 1440
				}),
				fluid({ vmax: 1600 }),
				// @ts-expect-error - Known issue with LightningCSS
				size
			])
		}
	},
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version),
		'import.meta.env.build': JSON.stringify(format_date('{DD}-{MM}-{YYYY}@{HH}:{mm}:{ss}'))
	},
	plugins: [
		sveltekit(),
		devtools_json(),
		redirects(),
		schema({
			output_path: 'src/library',
			filename: 'components.schema.build.ts'
		})
	],
	resolve: { extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'] },
	server: {
		proxy: {},
		https: has_https_files
			? {
					key: readFileSync(key_url, 'utf8'),
					cert: readFileSync(cert_url, 'utf8')
				}
			: undefined
	},
	customLogger: logger
})

export type StoryblokCustomPlugins = {
	'uiloco-seo': import('storyloco/seo').SEO
}
