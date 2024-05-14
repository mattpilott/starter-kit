// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export * from '@neuekit/utils'

declare module '@neuekit/utils' {
	import type { Writable } from 'svelte/store'

	export function storable<T>(data: Record<string, unknown>, name?: string, session?: boolean): Writable<T>
}