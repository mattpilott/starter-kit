// See https://svelte.dev/docs/kit/types#app.d.ts

import type { LayoutData } from './routes/$types'

// for information about these interfaces
declare global {
	interface Window {
		dataLayer: Array<unknown>
	}

	interface ImportMetaEnv {
		readonly version: string
		readonly build: string
	}

	namespace App {
		interface Error {
			message: string
			code: string
			env?: string
		}
		interface Locals {
			version: import('$library/storyblok.js').Version
		}
		interface PageData {
			readonly layout: LayoutData['layout']
			readonly version: LayoutData['version']
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
