// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Window {
		dataLayer: Array<unknown>
	}

	interface ImportMetaEnv {
		readonly version: string
		readonly build: string
		readonly name: string
		readonly environment: 'development' | 'preview' | 'production'
	}

	namespace App {
		interface Error {
			message: string
			code: string
			env?: 'development' | 'preview' | 'production'
		}
		// interface Locals {}
		interface PageData {
			seo?: {
				title?: string
				description?: string
				image?: string
				type?: 'website' | 'article'
			}
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
