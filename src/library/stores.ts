import { writable } from 'svelte/store'
import { storable } from 'kitto/svelte'

export const ui = writable()

// cookies consent: undefined = undecided, true = accepted, false = rejected
export const prefs = storable<{ cookies?: boolean }>({}, 'prefs')
