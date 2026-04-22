import { dev } from '$app/environment'
import { ENVIRONMENT } from '$env/static/private'
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

	response.headers.set('Content-Security-Policy', "object-src 'none'; frame-ancestors https://app.storyblok.com")
	response.headers.set('Permissions-Policy', 'fullscreen=*')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')

	return response
}

const version: Handle = async ({ event, resolve }) => {
	event.locals.version = dev || event.url.searchParams.has('_storyblok') ? 'draft' : 'published'
	return await resolve(event)
}

export const handle = sequence(security_headers, version)
