import { sequence } from '@sveltejs/kit/hooks'
import { env } from '$env/dynamic/private'

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
	return {
		message: env.VERCEL_ENV !== 'production' ? error.message : 'Whoa there!',
		code: error?.code ?? 'UNKNOWN',
		env: env.VERCEL_ENV
	}
}

export const handle = sequence(async ({ event, resolve }) => {
	const response = await resolve(event)

	response.headers.set('Cache-Control', 'no-cache')
	response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
	response.headers.set('Permissions-Policy', 'fullscreen=*')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')

	return response
})
