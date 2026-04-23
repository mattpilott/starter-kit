import { api } from '$convex/_generated/api'
import { createConvexHttpClient, getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit'

export async function load({ locals: { version } }) {
	const auth_state = getAuthState()

	if (!auth_state.isAuthenticated) return { auth_state, current_user: null, version }

	const client = createConvexHttpClient()

	try {
		const current_user = await client.query(api.auth.get_current_user, {})
		return { auth_state, current_user, version }
	} catch {
		return { auth_state, current_user: null, version }
	}
}
