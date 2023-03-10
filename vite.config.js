import { sveltekit } from '@sveltejs/kit/vite'
import { readFileSync } from 'node:fs'

const { name, version } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))

/** @type {import('vite').UserConfig} */
export default {
	plugins: [sveltekit()],
	define: {
		'import.meta.env.name': JSON.stringify(name),
		'import.meta.env.version': JSON.stringify(version)
	}
}
