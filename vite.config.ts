import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, createLogger } from 'vite'
import { readFileSync, existsSync } from 'fs'
import { composeVisitors } from 'lightningcss'
import { format_date } from 'kitto'
import { breakpoints, fluid, size } from 'kitto/lightningcss'
import { fontless } from 'fontless'

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

// Build-time environment, baked into the bundle (like name/version/build below). `vite dev` →
// development; otherwise read whichever host's native build signal is present. These vars only
// exist at build time, which is exactly why we bake the result rather than read it at runtime.
function detect_environment(command: string) {
	if (command === 'serve') return 'development'
	const e = process.env
	// Optional explicit override for any host (set APP_ENV=preview|production in the build env).
	if (e.APP_ENV === 'preview' || e.APP_ENV === 'production') return e.APP_ENV
	// Vercel — production | preview | development.
	if (e.VERCEL_ENV) return e.VERCEL_ENV === 'production' ? 'production' : 'preview'
	// Netlify — production | deploy-preview | branch-deploy.
	if (e.CONTEXT) return e.CONTEXT === 'production' ? 'production' : 'preview'
	// Cloudflare Pages + Workers (Workers Builds) — only a branch name; production = main.
	const branch = e.CF_PAGES_BRANCH ?? e.WORKERS_CI_BRANCH
	if (branch) return branch === 'main' ? 'production' : 'preview'
	return 'production'
}

export default defineConfig(({ command }) => ({
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
		'import.meta.env.build': JSON.stringify(format_date('{DD}-{MM}-{YYYY}@{HH}:{mm}:{ss}')),
		'import.meta.env.environment': JSON.stringify(detect_environment(command))
	},
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			adapter: adapter(),
			alias: {
				$components: './src/components',
				$library: './src/library'
			}
		}),
		fontless()
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
}))
