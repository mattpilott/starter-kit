import { createAuthClient } from 'better-auth/svelte'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { magicLinkClient } from 'better-auth/client/plugins'

export const auth_client = createAuthClient({
	plugins: [convexClient(), magicLinkClient()]
})
