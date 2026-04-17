// See https://svelte.dev/docs/kit/types#app.d.ts
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
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
