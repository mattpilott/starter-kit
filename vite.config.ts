import devtoolsJson from 'vite-plugin-devtools-json'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, createLogger } from 'vite'
import { readFileSync, existsSync } from 'fs'
import { composeVisitors } from 'lightningcss'
import { formatDate } from 'kitto'
import { breakpoints, fluid, size } from 'kitto/lightningcss'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))
const keyUrl = new URL('localhost-key.pem', import.meta.url)
const certUrl = new URL('localhost.pem', import.meta.url)
const hasHttpsFiles = existsSync(keyUrl) && existsSync(certUrl)
const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
	if (msg.includes('vite:css') && msg.includes("'global'")) return
	loggerWarn(msg, options)
}

if (!hasHttpsFiles) {
	logger.warn('[vite] HTTPS cert/key not found; starting dev server without https.')
}

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
				size
			])
		}
	},
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version),
		'import.meta.env.build': JSON.stringify(formatDate('{DD}-{MM}-{YYYY}@{HH}:{mm}:{ss}'))
	},
	plugins: [sveltekit(), devtoolsJson()],
	resolve: { extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svelte'] },
	server: {
		proxy: {},
		https: hasHttpsFiles && {
			key: readFileSync(keyUrl, 'utf8'),
			cert: readFileSync(certUrl, 'utf8')
		}
	},
	customLogger: logger
})
