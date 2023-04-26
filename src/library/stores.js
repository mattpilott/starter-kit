import { writable } from 'svelte/store'
import { storable } from '@neuekit/utils'

export const ui = writable()
export const prefs = storable({ cookie: undefined }, 'prefs')
