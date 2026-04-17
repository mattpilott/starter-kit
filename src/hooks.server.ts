import { ENVIRONMENT } from '$env/static/private'

export function handleError({ error }) {
	const err = error instanceof Error ? error : new Error('Unknown error')

	return {
		message: ENVIRONMENT !== 'production' ? err.message : 'Whoa there!',
		code: 'code' in err && typeof err.code === 'string' ? err.code : 'UNKNOWN',
		env: ENVIRONMENT
	}
}

export const handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	response.headers.set('Cache-Control', 'no-cache')
	response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
	response.headers.set('Permissions-Policy', 'fullscreen=*')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')

	return response
}
