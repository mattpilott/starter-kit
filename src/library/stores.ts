import { writable } from 'svelte/store'
import { storable } from 'kitto/svelte'

export const ui = writable()
export const prefs = storable({ cookie: undefined }, 'prefs')
