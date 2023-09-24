export * from '@neuekit/utils'

declare module '@neuekit/utils' {
   import type { Writable } from 'svelte/store'

   export function storable<T>(data: Record<string, unknown>, name?: string, session?: boolean): Writable<T>
}