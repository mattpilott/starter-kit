import { dev } from '$app/environment'
import { ENVIRONMENT } from '$env/static/private'
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit'
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

export function handleError({ error }) {
	const err = error instanceof Error ? error : new Error('Unknown error')

	return {
		message: ENVIRONMENT !== 'production' ? err.message : 'Whoa there!',
		code: 'code' in err && typeof err.code === 'string' ? err.code : 'UNKNOWN',
		env: ENVIRONMENT
	}
}

const security_headers: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	// responses returned from fetch() (e.g. the /api/auth/* forwarder) have
	// an immutable headers guard, so clone into a mutable Headers first
	const headers = new Headers(response.headers)
	// HTTP/1-only hop-by-hop headers; Node's http2 throws on them when Vite
	// serves the dev site over HTTPS (https://localhost uses HTTP/2)
	for (const h of ['transfer-encoding', 'connection', 'keep-alive', 'upgrade']) headers.delete(h)

	headers.set('Content-Security-Policy', "object-src 'none'; frame-ancestors https://app.storyblok.com")
	headers.set('Permissions-Policy', 'fullscreen=*')
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	headers.set('X-Content-Type-Options', 'nosniff')
	headers.set('X-Frame-Options', 'SAMEORIGIN')

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	})
}

const version: Handle = async ({ event, resolve }) => {
	event.locals.version = dev || event.url.searchParams.has('_storyblok') ? 'draft' : 'published'
	return await resolve(event)
}

const auth: Handle = async ({ event, resolve }) => {
	const token = getToken(event.cookies)
	event.locals.token = token
	return withServerConvexToken(token, () => resolve(event))
}

export const handle = sequence(security_headers, version, auth)
