import { ENVIRONMENT } from '$env/static/private'

export async function GET() {
	const production = ENVIRONMENT === 'production'
	const allow = 'User-agent: *\nDisallow:\n'
	const disallow = 'User-agent: *\nDisallow: /\n'

	return new Response(production ? allow : disallow, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	})
}
